<template>
  <div>
    <b-modal id="crontabModal" title="Download Crontab" size="xl" ok-only ok-title="Cancel">
      <b-form @submit="onSubmit" @reset="onReset">
        <b-form-group id="hostnamegroup" label="Hostname" label-for="hostnameInput" description="The target host">
          <b-form-select id="hostnameInput" v-model="form.host" :options="hosts"></b-form-select>
        </b-form-group>
        <b-form-group v-if="hasImages" label="Container Image" label-for="containerImageInput" description="Host has containers. Build for container?">
          <b-form-select id="containerImageInput" v-model="form.imgName" :options="containerImages">
            <b-form-select-option :value="null" disabled></b-form-select-option>
          </b-form-select>
        </b-form-group>
        <div v-if="cronResults">
          <b-form-group id="outputgroup" label="output" label-for="txtAreaCronResults" description="Review and Modify Results">
            <b-form-textarea id="txtAreaCronResults" v-model="cronResults" rows="15"></b-form-textarea>
          </b-form-group>
          <b-button style="float:right" @click="copyToClipboard"><b-icon-files></b-icon-files></b-button>
        </div>
        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
      <div v-if="errorStr">
        <code>{{errorStr}}</code>
      </div>
    </b-modal>
  </div>
</template>

<style></style>

<script>

import CommonMethods from '../CommonMethods';

export default{
  name:'CrontabModal',
  components:{},
  props:{},
  computed:{
    hosts(){
      return this.$store.state.jobs.map(e => e.hostname).filter(CommonMethods.uniqueValues);
    },
    containerImages(){
      return this.$store.state.jobs.filter(e => e.container && e.hostname == this.form.host).map(e => e.imgName).filter(CommonMethods.uniqueValues);
    },
    hasImages(){
      return this.containerImages.length ? true:false;
    },
    cronResults(){
      return this.$store.state.crontab;
    }
  },
  methods:{
    async onSubmit(event){
      event.preventDefault();
      this.errorStr = null;
      this.$store.dispatch('emptyCrontab');
      let isImg = this.form.imgName === null ? false:true;
      let hostname = this.form.imgName === null ? this.form.host:this.form.imgName;
      try{
        await this.$store.dispatch('getCrontab',{hostname:hostname,isImg:isImg});
      }catch(err){
        this.errorStr = err;
      }
    },
    onReset(event){
      event.preventDefault();
    },
    copyToClipboard(){
      CommonMethods.copyToClipboard(this.cronResults);
    }
  },
  data(){
    return {
      form:{
        host:null,
        imgName:null
      },
      errorStr:null
    }
  }
}
</script>
