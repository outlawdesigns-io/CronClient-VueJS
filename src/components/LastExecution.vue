<template>
  <div>
    <table class="table table-bordered table-secondary">
      <thead>
        <tr>
          <td colspan="2"><h6>Last Execution</h6></td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Start: {{new Date(job.lastExecution.startTime).toLocaleString()}}</td>
          <td>End: {{new Date(job.lastExecution.endTime).toLocaleString()}}</td>
        </tr>
        <tr>
          <td colspan="2">
            <textarea style="height:200px" class="form-control" rows="2" v-model="job.lastExecution.output" readonly></textarea>
          </td>
        </tr>
        <tr>
          <td><b-button @click="copyToClipboard"><IBiEnvelope/></b-button></td>
          <td><b-button @click="$store.dispatch('populateSendOutputModal',job)" v-b-modal.sendOutputModal><IBiFiles/></b-button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

import CommonMethods from '../CommonMethods';

export default {
  name: 'LastExecution',
  props: {
    job: Object
  },
  methods:{
    async copyToClipboard(){
      CommonMethods.copyToClipboard(this.job.lastExecution.output);
    }
  }
}
</script>
<style></style>
