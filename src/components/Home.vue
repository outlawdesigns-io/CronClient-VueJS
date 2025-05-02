<template>
  <div>
    <img alt="Vue logo" src="../assets/turtle_man.png">
    <HelloWorld msg="Cron Monitor"/>
    <p v-if="!jobs.length">Waiting for data...</p>
    <b-spinner v-if="!jobs.length" type="grow" label="Spinning"></b-spinner>
    <div v-if="jobs.length" class="row">
      <div class="col-md-12">
        <JobBox
        v-for="job in jobs"
        v-bind:key="job.id"
        v-bind:job="job"></JobBox>
      </div>
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
      return this.$store.state.jobs.filter(e => !e.disabled).slice().sort(CommonMethods.sortByNextExecution);
    }
  }
}
</script>
