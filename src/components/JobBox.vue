<template>
  <div>
    <BCard no-body class="mb-1" :class="[isRepollingClass]">
      <!-- Header slot replaces <b-card-header> -->
      <template #header>
        <BButton class="longBtn" block variant="info" @click="toggleCollapse">
          <span class="dot" :class="[dotClass]"></span>
          <span>{{ job.title }} | </span>
          <CountDownTimer :endDate="nextRun" />
          <span> ( {{ job.friendlyTime }} )</span>
        </BButton>
      </template>

      <!-- Collapse section -->
      <BCollapse :id="'accordion-' + job.id" v-model="isOpen" accordion="my-accordion" role="tabpanel">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-bordered table-secondary">
              <tbody>
                <tr>
                  <td colspan="3">{{ job.description }}</td>
                </tr>
                <tr>
                  <td>Hostname: {{ job.hostname }}</td>
                  <td>User: {{ job.user }}</td>
                  <td>Cron Annotation: {{ job.cronTime }}</td>
                </tr>
                <tr>
                  <td colspan="3">{{ job.cmdToExec }}</td>
                </tr>
                <tr>
                  <td colspan="3">Outfile: {{ job.outfile }}</td>
                </tr>
                <tr v-if="job.container">
                  <td colspan="3">Container: {{ job.imgName }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <LastExecution v-if="job.lastExecution" :job="job" />
          <div v-else>
            <p>No execution history for this job</p>
          </div>

          <!-- Action buttons -->
          <div>
            <BButton
              id="btnCheckNow"
              class="longBtn"
              variant="success"
              v-if="isRepollDelay || repollOn"
              @click="checkExecution"
            >
              Check Now
            </BButton>
            <BButton
              id="btnDisableJob"
              class="longBtn"
              variant="warning"
              @click="onDisable"
            >
              Disable
            </BButton>
            <BButton
              id="btnDeleteJob"
              class="longBtn"
              variant="danger"
              @click="onDelete"
            >
              Delete
            </BButton>

            <!-- Delete overlay -->
            <BOverlay :show="confirmDelete" no-wrap>
              <template #overlay>
                <div v-if="processingDelete">
                  <BSpinner label="Spinning" class="mx-1" />
                  <div class="mb-3">Processing...</div>
                </div>
                <div v-else>
                  <p><strong>Delete this job and all execution history?</strong></p>
                  <div class="d-flex">
                    <BButton
                      variant="outline-danger"
                      class="me-3"
                      @click="onCancelDelete"
                    >
                      Cancel
                    </BButton>
                    <BButton
                      variant="outline-success"
                      @click="onDeleteConfirm"
                    >
                      Confirm
                    </BButton>
                  </div>
                </div>
              </template>
            </BOverlay>

            <!-- Disable overlay -->
            <BOverlay :show="confirmDisable" no-wrap>
              <template #overlay>
                <div v-if="processingDelete">
                  <BSpinner label="Spinning" class="mx-1" />
                  <div class="mb-3">Processing...</div>
                </div>
                <div v-else>
                  <p><strong>Disable this job and remove it from reports and apps?</strong></p>
                  <div class="d-flex">
                    <BButton
                      variant="outline-danger"
                      class="me-3"
                      @click="onCancelDisable"
                    >
                      Cancel
                    </BButton>
                    <BButton
                      variant="outline-success"
                      @click="onDisableConfirm"
                    >
                      Confirm
                    </BButton>
                  </div>
                </div>
              </template>
            </BOverlay>
          </div>
        </div>
      </BCollapse>
    </BCard>
  </div>

</template>


<script>
// import { useStore } from 'vuex';
import { ref,computed, watch } from 'vue';
import LastExecution from './LastExecution.vue'
import CountDownTimer from './CountDownTimer.vue';
import { DateTime } from 'luxon'

export default {
  name: 'JobBox',
  components:{
    CountDownTimer,
    LastExecution,
  },
  props: {
    job:Object
  },
  data(){
    return {
      now:DateTime.local(),
      isRepollDelay:false,
      repollOn:false,
      confirmDelete:false,
      confirmDisable:false,
      processingDelete:false,
      isOpen:false
    };
  },
  mounted(){
    this.startTimer();
  },
  methods:{
    startTimer(){
      setInterval(()=>{
        this.now = DateTime.local();
      },1000);
    },
    checkExecution(){
      this.$store.dispatch('getJob',this.job.id);
    },
    onDelete(){
      this.confirmDelete = true;
    },
    onDisable(){
      this.confirmDisable = true;
    },
    onDeleteConfirm(){
      this.processingDelete = true;
      this.$store.dispatch('deleteJob',this.job.id).then(()=>{
        this.confirmDelete = false;
        this.processingDelete = false;
      })
    },
    onDisableConfirm(){
      this.processingDelete = true;
      this.$store.dispatch('disableJob',this.job.id).then(()=>{
        this.confirmDisable = false;
        this.processingDelete = false;
      });
    },
    onCancelDelete(){
      this.confirmDelete = false;
    },
    onCancelDisable(){
      this.confirmDisable = false;
    },
    toggleCollapse(){
      this.isOpen = !this.isOpen;
    }
  },
  computed:{
    isOverDue(){
      return this.job.lastExecution && Date.parse(this.job.lastExecution.endTime) < Date.parse(this.job.lastRun);
    },
    timeoutDelay(){
      return this.job.avgExecutionSeconds && Math.round(this.job.avgExecutionSeconds) > 10 ? Math.round(this.job.avgExecutionSeconds) * 1000:10000;
    },
    isRepollingClass(){
      if(this.repollOn){
        return 'repollingCard';
      }
      return 'standardCard';
    },
    dotClass(){
      if(this.isRepollDelay){
        return 'yellowDot';
      }else if(!this.job.lastExecution){
        return 'orangeDot';
      }else if(this.isOverDue){
        return 'redDot';
      }
      return 'greendDot';
    },
    nextRun:{
      get(){
        return this.job.nextRun;
      },
      set(newValue){
        this.job.nextRun = newValue;
      }
    },
    overDueBy(){
      let expected = Date.parse(this.job.lastRun);
      let actual = Date.parse(this.job.lastExecution.endTime);
      let now = Date.now();
      let overDueMs = expected - actual;
      let overDueDate = new Date(now - overDueMs);
      return overDueDate.toISOString();
    }
  },
  watch:{
    now(newValue){
      let next = new Date(this.nextRun);
      let nextRunPassed = (newValue.toJSDate() >= next);
      if(nextRunPassed && !this.isRepollDelay && !this.repollOn){
        this.nextRun = new Date(this.now.toJSDate().getTime() + this.timeoutDelay).toISOString();
        this.isRepollDelay = true;
        setTimeout(this.checkExecution,this.timeoutDelay);
      }
    },
    job(newValue){
      this.isRepollDelay = false;
      if(this.isOverDue){
        this.repollOn = true;
        this.nextRun = new Date(this.now.toJSDate().getTime() + this.timeoutDelay).toISOString();
        setTimeout(this.checkExecution,this.timeoutDelay);
      }else{
        this.repollOn = false;
      }
    }
  }
}

</script>

<style>
.redDot {
  height: 25px;
  width: 25px;
  background-color: #f00707;
  border-radius: 50%;
  display: inline-block;
  float:left;
}
.greendDot {
  height: 25px;
  width: 25px;
  background-color:#69f542;
  border-radius: 50%;
  display: inline-block;
  float:left;
}
.orangeDot {
  height: 25px;
  width: 25px;
  background-color: #fac400;
  border-radius: 50%;
  display: inline-block;
  float:left;
}
.yellowDot {
  height: 25px;
  width: 25px;
  background-color: #edf505;
  border-radius: 50%;
  display: inline-block;
  float:left;
}
.standardCard{

}
.repollingCard{
  border:2px solid red;
}
.longBtn{
  width: 100%;
  margin:.25%;
}
#divConfirmDelete{
  text-align: center;
}
</style>
