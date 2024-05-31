<template>
  <div>
    <table class="table table-bordered greyTable">
      <thead>
        <tr>
          <td colspan="2"><h6>Last Execution</h6></td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Start: {{job.lastExecution.startTime}}</td>
          <td>End: {{job.lastExecution.endTime}}</td>
        </tr>
        <tr>
          <td colspan="2">
            <textarea style="height:200px" class="form-control" rows="2" v-model="job.lastExecution.output" readonly></textarea>
          </td>
        </tr>
        <tr>
          <td><b-button @click="copyToClipboard"><b-icon-files></b-icon-files></b-button></td>
          <td><b-button @click="$store.dispatch('populateSendOutputModal',job)" v-b-modal.sendOutputModal><b-icon-envelope></b-icon-envelope></b-button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'LastExecution',
  props: {
    job: Object
  },
  methods:{
    async copyToClipboard(){
      try{
        await navigator.clipboard.writeText(this.job.lastExecution.output);
      }catch(err){
        alert(err);
      }
    }
  }
}
</script>
<style></style>
