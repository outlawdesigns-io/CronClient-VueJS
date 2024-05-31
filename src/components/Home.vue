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
import HelloWorld from './HelloWorld';
import SendOutputModal from './SendOutputModal.vue';

export default {
  name: 'Home',
  components: {
    JobBox,
    HelloWorld,
    SendOutputModal
  },
  computed:{
    jobs(){
      return this.$store.state.jobs.slice().sort((a,b)=>{
        return new Date(a.nextRun) - new Date(b.nextRun);
      });
    }
  }
}
</script>
