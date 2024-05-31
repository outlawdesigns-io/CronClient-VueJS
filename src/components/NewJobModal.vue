<template>
  <div>
    <b-modal id="newJobModal" title="New Job" ok-only ok-variant="secondary" ok-title="Cancel">
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <b-form-group id="titleGroup" label="Title" label-for="titleInput" description="Descriptive name for this job">
          <b-form-input id="titleInput" type="text" placeholder="System Backup" v-model="form.title" required></b-form-input>
        </b-form-group>
        <b-form-group id="descriptionGroup" label="Description" label-for="descriptionInput" description="Long form description of what this job does">
          <b-form-input id="descriptionInput" type="text" placeholder="Perform dd backup of the system to NAS" v-model="form.description" required></b-form-input>
        </b-form-group>
        <b-form-group id="hostGroup" label="Host" label-for="hostInput" description="The server on which this job runs">
          <b-form-input id="hostInput" type="text" placeholder="ubunutuserver2" v-model="form.hostname" required></b-form-input>
        </b-form-group>
        <b-form-group id="userGroup" label="User" label-for="userInput" description="The user account on whose crontab this job runs">
          <b-form-input id="userInput" type="text" placeholder="root" v-model="form.user" required></b-form-input>
        </b-form-group>
        <b-form-group id="cronTimeGroup" label="Cron Time" label-for="cronTimeInput" description="Cron time annotation of execution frequency">
          <b-form-input id="cronTimeInput" type="text" placeholder="0 3 * * 2" v-model="form.cronTime" required></b-form-input>
        </b-form-group>
        <b-form-group id="friendlyTimeGroup" label="Friendly Time" label-for="friendlyTimeInput" description="Long form description of execution frequency">
          <b-form-input id="friendlyTimeInput" type="text" placeholder="At 03:00 on Tuesday" v-model="form.friendlyTime" required></b-form-input>
        </b-form-group>
        <b-form-group id="cmdToExecGroup" label="Command to Execute" label-for="cmdToExecInput" description="The command that this job executes">
          <b-form-input id="cmdToExecInput" type="text" placeholder="dd if=/dev/mmcblk0 of=/mnt/backups/`hostname`.img" v-model="form.cmdToExec" required></b-form-input>
        </b-form-group>
        <b-form-group id="containerGroup">
          <b-form-checkbox value="1" v-model="form.container">Container</b-form-checkbox>
        </b-form-group>
        <b-form-group id="imgNameGroup" label="Container" label-for="imgNameInput" description="The image name of this container" v-if="form.container">
          <b-form-input id="imgNameInput" type="text" v-model="form.imgName" placeholder="mywebserver:latest"></b-form-input>
        </b-form-group>
        <b-form-group id="outFileGroup" label="Outfile" label-for="outFileInput" description="The absolute path to the file that will store this job's output">
          <b-form-input id="outFileInput" type="text" v-model="form.outfile" placeholder="/tmp/backup"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
      <div v-if="!show">
        <p>{{completionStr}}</p>
        <code>{{resultStr}}</code>
        <br><br>
        <b-button @click="onReset" variant="danger">Reset</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>

export default {
  name:'NewJobModal',
  components:{},
  props:{},
  computed:{},
  methods:{
    async onSubmit(event){
      event.preventDefault();
      try{
        await this.$store.dispatch('createJob',this.form);
        let newJob = this.$store.state.jobs[this.$store.state.jobs.length - 1];
        this.resultStr = newJob.cronTime + ' ' + '/path/to/cronWrapper.sh ' + newJob.id + ' "(time ' + newJob.cmdToExec + ')" ' + '"' + newJob.outfile + '"';
        this.completionStr = "Copy and paste the line below into the specified user's cron file.";
      }catch(err){
        this.completionStr = "An error occurred.";
        this.resultStr = err;
      }
      this.show = false;
    },
    onReset(event){
      event.preventDefault();
      this.form.title = null;
      this.form.description = null;
      this.form.hostname = null;
      this.form.user = null;
      this.form.cronTime = null;
      this.form.friendlyTime = null;
      this.form.cmdToExec = null;
      this.form.container = 0,
      this.form.imgName = null;
      this.form.outfile = null;
      this.show = true;
    }
  },
  data(){
    return {
      form:{
        title:null,
        description:null,
        hostname:null,
        user:null,
        cronTime:null,
        friendlyTime:null,
        cmdToExec:null,
        container:0,
        imgName:null,
        outfile:null
      },
      show:true,
      resultStr:'',
      completionStr:''
    }
  },

}

</script>
