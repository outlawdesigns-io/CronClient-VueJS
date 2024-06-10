<template>
  <div>
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block href="#" v-b-toggle="'accordion-' + job.id" variant="info">
          <!-- v-on:click="getLastExecution" -->
          <span class="dot" v-bind:class="[isOverDue]"></span>
          <span style="">{{job.title}} |</span>
          <!-- <span></span> -->
          <span style=""> {{job.friendlyTime}} |</span>
          <NextJobCountDown v-bind:endDate="job.nextRun"></NextJobCountDown>
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
      staticTime:'Sun, 06 Nov 2022 08:49:37 GMT',
      //currentLastExecution:{id:0,jobId:0,startTime:'',endTime:'',output:''}
    };
  },
  computed:{
    isOverDue(){
      if(!this.job.lastExecution){
        return 'orangeDot';
      }else if(Date.parse(this.job.lastExecution.endTime) < Date.parse(this.job.lastRun)){
        return 'redDot';
      }
      return 'greendDot';
    }
  }
}

/*
{'cssClassName':sourceofTruth}
*/

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
</style>
