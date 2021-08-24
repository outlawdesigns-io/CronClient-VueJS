<template>
  <div>
    <table class="table table-bordered">
      <thead>
        <tr>
          <td colspan="2"><h6>Last Execution</h6></td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Start: {{execution.startTime}}</td>
          <td>End: {{execution.endTime}}</td>
        </tr>
        <tr>
          <td colspan="2">
            <textarea style="height:200px" class="form-control" rows="2" v-model="execution.output" readonly></textarea>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'LastExecution',
  props: {
    execution: Object
  }
}
</script>
