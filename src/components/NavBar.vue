<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">Cron Monitor</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item v-b-modal.newJobModal>Add a Job</b-nav-item>
          <b-nav-item v-b-modal.crontabModal>Build Crontab</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <NewJobModal></NewJobModal>
    <CrontabModal></CrontabModal>
  </div>
</template>

<script>

import NewJobModal from './NewJobModal.vue';
import CrontabModal from './CrontabModal.vue';
export default {
  name: 'NavBar',
  components: {
    NewJobModal,
    CrontabModal
  },
  computed:{}
}
</script>
