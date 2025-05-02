<template>
  <div>
    <b-modal id="subscriptionModal" title="Event Subscriptions" ok-only ok-title="Cancel" size="xl">
        <b-table striped hover responsive :items="subscriptions" show-empty>
          <template #cell(actions)="row">
            <div class="d-flex gap-2">
              <b-button size="sm" variant="info" @click="setEditRecord(row.item)">Edit</b-button>
              <b-button size="sm" variant="danger" @click="deleteRecord(row.item)">Delete</b-button>
            </div>
          </template>
        </b-table>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <b-form-group id="eventGroup" label="Event" label-for="eventInput" description="Target Event">
            <b-form-select v-model="form.eventId" :options="eventTypes"></b-form-select>
          </b-form-group>
          <b-form-group id="recipientGroup" label="To" label-for="recipientInput" description="; separated list of email addresses">
            <b-form-input id="recipientInput" type="text" placeholder="user@example.com;person@domain.org" v-model="form.recipient" required></b-form-input>
          </b-form-group>
          <b-form-group id="recipient_ccGroup" label="CC" label-for="recipientCCInput" description="; separated list of email addresses">
            <b-form-input id="recipientCCInput" type="text" placeholder="user@example.com;person@domain.org" v-model="form.recipient_cc"></b-form-input>
          </b-form-group>
          <b-form-group id="recipient_bccGroup" label="BCC" label-for="recipientBCCInput" description="; separated list of email addresses">
            <b-form-input id="recipientBCCInput" type="text" placeholder="user@example.com;person@domain.org" v-model="form.recipient_bcc"></b-form-input>
          </b-form-group>
          <b-form-group id="disabledGroup">
            <b-form-checkbox value="1" v-model="form.disabled">Disabled</b-form-checkbox>
          </b-form-group>
          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
        <template #modal-footer>
          <div class="w-100">
            <b-button variant="success" @click="toggleShowForm">New</b-button>
          </div>
        </template>
    </b-modal>
  </div>
</template>

<script>

export default {
  name:'SubscriptionModal',
  components:{},
  props:{},
  methods:{
    async onSubmit(event){
      event.preventDefault();
      try{
        if(this.updateMode){
          this.form.id = this.updateId;
          this.form.disabled = this.form.disabled ? 1:0;
          this.$store.dispatch('updateEventSubscription',this.form);
          // this.onReset(event);
        }else{
          this.$store.dispatch('createEvenSubscription',this.form);
        }
      }catch(err){
        console.error(err);
      }
    },
    onReset(event){
      event.preventDefault();
      this.updateMode = false;
      this.updateId = null;
      Object.keys(this.form).forEach((e)=>{
        this.form[e] = null;
      });
    },
    toggleShowForm(){
      this.show = !this.show;
    },
    setEditRecord(subscription){
      this.show = true;
      this.updateMode = true;
      this.updateId = subscription.id;
      this.form.eventId = this.$store.state.events.filter(e => e.name === subscription.event)[0]?.id;
      this.form.recipient = subscription.recipient;
      this.form.recipient_cc = subscription.recipient_CC;
      this.form.recipient_bcc = subscription.recipient_BCC;
      this.form.disabled = subscription.disabled ? 1:0;
    },
    deleteRecord(subscription){
      try{
        this.$store.dispatch('deleteEventSubscription',subscription.id);
      }catch(err){
        console.error(err);
      }
    }
  },
  computed:{
    subscriptions(){
      return this.$store.state.eventSubscriptions.map((e)=>{
        return {
          id:e.id,
          event:this.$store.state.events.filter(f => f.id === e.eventId)[0]?.name,
          recipient:e.recipient,
          recipient_CC:e.recipient_cc,
          recipient_BCC:e.recipient_bcc,
          disabled:e.disabled ? true:false,
          actions:null
        }
      });
    },
    eventTypes(){
      return this.$store.state.events.map((e)=>{
        return {value: e.id, text:e.name}
      });
    }
  },
  data(){
    return {
      form:{
        eventId:null,
        recipient:null,
        recipient_cc:null,
        recipient_bcc:null,
        disabled:0
      },
      show:false,
      updateMode:false,
      updateId:null
    }
  }
}

</script>
