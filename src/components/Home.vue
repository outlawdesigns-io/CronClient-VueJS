<template>
  <div>
    <img alt="Vue logo" src="../assets/turtle_man.png">
    <HelloWorld msg="Cron Monitor"/>
    <div class="row">
      <div class="col-md-4"></div>
      <div class="col-md-4">
        <JobBox
        v-for="job in jobs"
        v-bind:key="job.id"
        v-bind:job="job"></JobBox>
      </div>
      <div class="col-md-4"></div>
    </div>
    <SendOutputModal></SendOutputModal>
  </div>
</template>

<script>
import JobBox from './JobBox.vue'
import HelloWorld from './HelloWorld.vue';
import SendOutputModal from './SendOutputModal.vue';
import CommonMethods from '../CommonMethods';

export default {
  name: 'Home',
  components: {
    JobBox,
    HelloWorld,
    SendOutputModal
  },
  computed:{
    jobs(){
      return this.$store.state.jobs.slice().sort(CommonMethods.sortByNextExecution);
    }
  }
}
</script>
