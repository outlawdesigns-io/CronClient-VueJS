<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">Cron Monitor</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item v-b-modal.newJobModal>Add a Job</b-nav-item>
          <b-nav-item v-b-modal.disabledJobsModal>Disabled Jobs</b-nav-item>
          <b-nav-item v-b-modal.crontabModal>Build a crontab</b-nav-item>
          <b-nav-item v-b-modal.testCronPatternModal>Test a cron Pattern</b-nav-item>
          <b-nav-item v-b-modal.subscriptionModal>Manage Subscriptions</b-nav-item>
          <b-nav-item :href="gistUrl" target="_blank">cronWrapper.sh</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <NewJobModal></NewJobModal>
    <CrontabModal></CrontabModal>
    <SubscriptionModal></SubscriptionModal>
    <TestCronPatternModal></TestCronPatternModal>
    <DisabledJobsModal></DisabledJobsModal>
  </div>
</template>

<script>

import AppConfig from '../AppConfig';
import NewJobModal from './NewJobModal.vue';
import CrontabModal from './CrontabModal.vue';
import SubscriptionModal from './SubscriptionModal.vue';
import TestCronPatternModal from './TestCronPatternModal.vue';
import DisabledJobsModal from './DisabledJobsModal.vue';

export default {
  name: 'NavBar',
  components: {
    NewJobModal,
    CrontabModal,
    TestCronPatternModal,
    SubscriptionModal,
    DisabledJobsModal
  },
  computed:{},
  data(){
    return {
      gistUrl:AppConfig[process.env.NODE_ENV].GIST_URL
    }
  }
}
</script>
