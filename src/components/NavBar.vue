<template>
  <div>
    <BNavbar toggleable="lg" type="dark" variant="info">
      <BNavbarBrand href="#">Cron Monitor</BNavbarBrand>
      <BNavbarToggle target="nav-collapse"></BNavbarToggle>
      <BCollapse id="nav-collapse" is-nav>
        <BNavbarNav>
          <BNavItem v-b-modal.newJobModal>Add a Job</BNavItem>
          <BNavItem v-b-modal.disabledJobsModal>Disabled Jobs</BNavItem>
          <BNavItem v-b-modal.crontabModal>Build a crontab</BNavItem>
          <BNavItem v-b-modal.testCronPatternModal>Test a cron Pattern</BNavItem>
          <BNavItem v-b-modal.subscriptionModal>Manage Subscriptions</BNavItem>
          <BNavItem :href="gistUrl" target="_blank">cronWrapper.sh</BNavItem>
        </BNavbarNav>
        <BNavbarNav class="ms-auto mb-2 mb-lg-0">
          <BNavItem right @click="swapTheme()">
            <IBiMoon v-if="mode == 'light'" />
            <IBiSun v-if="mode == 'dark'" />
          </BNavItem>
        </BNavbarNav>
        <BNavbarNav class="ml-auto">
          <BNavItem right @click="logout">log out</BNavItem>
        </BNavbarNav>
      </BCollapse>
    </BNavbar>
    <NewJobModal></NewJobModal>
    <CrontabModal></CrontabModal>
    <SubscriptionModal></SubscriptionModal>
    <TestCronPatternModal></TestCronPatternModal>
    <DisabledJobsModal></DisabledJobsModal>
  </div>
</template>

<script>

import { getConfig } from '../runtime-config';
import { useColorMode } from 'bootstrap-vue-next'
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
  methods:{
    logout(){
      this.$store.dispatch('logout');
    },
    swapTheme(){
      this.mode = this.mode === 'dark' ? 'light' : 'dark'
    }
  },
  data(){
    return {
      gistUrl:getConfig().GIST_URL,
      mode:useColorMode()
    }
  }
}
</script>
