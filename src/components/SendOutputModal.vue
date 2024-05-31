<template>
  <div>
    <b-modal id="sendOutputModal" title="Send Output">
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <b-form-group id="toGroup" label="To" label-for="toInput" description="Email address of recipient">
          <b-form-input id="toInput" type="text" placeholder="user@example.com" v-model="form.to" required></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button v-el:resetBtn type="reset" variant="danger">Reset</b-button>
      </b-form>
      <div v-if="!show">
        <p>{{completionStr}}</p>
        <code>{{resultStr}}</code>
        <br><br>
        <b-button @click="onReset" variant="danger">Reset Form</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>



export default {
  name:'SendOutputModal',
  components:{},
  props:{
    job: Object
  },
  methods:{
    async onSubmit(event){
      event.preventDefault();
      let message = {
        msg_name:'Cron_Ouput',
        to:[this.form.to],
        subject:"Cron output for Job: " + this.$store.state.sendOutputModalData.title,
        body:this.$store.state.sendOutputModalData.lastExecution.output,
        flag:this.$store.state.sendOutputModalData.id + '_' + this.$store.state.sendOutputModalData.lastExecution.id,
        sent_by:'CronClient-App' //maybe should be user id
      };
      try{
        await this.$store.dispatch('mailOutput',message);
        this.completionStr = "Success!";
        this.resultStr = "Output sent to " + this.form.to;
      }catch(err){
        this.completionStr = "Error";
        this.resultStr = err;
      }
      this.show = false;
    },
    onReset(event){
      event.preventDefault();
      this.form.to = null;
      this.show = true;
    }
  },
  data(){
    return {
      form:{
        to:null,
      },
      show:true,
      completionStr:null,
      resultStr:null
    }
  }

}

</script>
