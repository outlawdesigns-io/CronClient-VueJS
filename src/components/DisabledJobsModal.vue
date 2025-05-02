<template>
  <div>
    <b-modal id="disabledJobsModal" title="Disabled Jobs" ok-only ok-title="Cancel" size="xl">
      <b-table striped hover responsive :items="jobs" show-empty>
        <template #cell(actions)="row">
          <div class="d-flex gap-2">
            <b-button size="sm" variant="info" @click="enableRecord(row.item)">Enable</b-button>
            <b-button size="sm" variant="danger" @click="deleteRecord(row.item)">Delete</b-button>
          </div>
        </template>
      </b-table>
    </b-modal>
  </div>
</template>

<script>

export default{
  name:'DisabledJobsModal',
  props:{},
  components:{},
  methods:{
    enableRecord(job){
      try{
        this.$store.dispatch('enableJob',job.id);
      }catch(err){
        alert(err);
      }
    },
    deleteRecord(job){
      try{
        this.$store.dispatch('deleteJob',job.id);
      }catch(err){
        alert(err);
      }
    }
  },
  computed:{
    jobs(){
      return this.$store.state.jobs.filter(e => e.disabled).map((e)=>{
        return {
          id:e.id,
          title:e.title,
          cronTime:e.cronTime,
          friendlyTime:e.friendlyTime,
          actions:null
          // description:e.description
        };
      });
    }
  },
  data(){
    return {

    }
  }
}

</script>
