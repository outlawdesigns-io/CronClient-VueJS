<template>
  <div>
    <b-card no-body class="mb-1" v-bind:class="[isRepollingClass]">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block href="#" v-b-toggle="'accordion-' + job.id" variant="info">
          <!-- v-on:click="getLastExecution" -->
          <span class="dot" v-bind:class="[dotClass]"></span>
          <span style="">{{job.title}} |</span>
          <!-- <span></span> -->
          <span style=""> {{job.friendlyTime}} |</span>
          <NextJobCountDown :endDate="nextRun"></NextJobCountDown>
        </b-button>
      </b-card-header>
      <b-collapse :id="'accordion-' + job.id" visible accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <!-- <b-card-text>accordion {{job.id}} text</b-card-text> -->
          <div class="table-responsive">
            <table class="table table-bordered greyTable">
              <thead></thead>
              <tbody>
                <tr>
                  <td colspan="3">{{job.description}}</td>
                </tr>
                <tr>
                  <td>Hostname: {{job.hostname}}</td>
                  <td>User: {{job.user}}</td>
                  <td>Cron Annotation: {{job.cronTime}}</td>
                </tr>
                <tr>
                  <td colspan="3">{{job.cmdToExec}}</td>
                </tr>
                <tr>
                  <td colspan="3">Outfile: {{job.outfile}}</td>
                </tr>
                <tr v-if="job.container">
                  <td colspan="3">Container: {{job.imgName}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <LastExecution v-if="job.lastExecution" v-bind:job="job"></LastExecution>
          <div v-if="!job.lastExecution">
            <p>No execution history for this job</p>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>


<script>

import NextJobCountDown from './NextJobCountDown.vue'
import LastExecution from './LastExecution.vue'
import { DateTime } from 'luxon'

export default {
  name: 'JobBox',
  components:{
    NextJobCountDown,
    LastExecution
  },
  props: {
    job:Object
  },
  data(){
    return {
      now:DateTime.local(),
      isRepollDelay:false,
      repollOn:false,
      // timeoutDelay:10000
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
  background-color: #d4ff00;
  border-radius: 50%;
  display: inline-block;
  float:left;
}
.standardCard{

}
.repollingCard{
  border:2px solid red;
}
</style>
