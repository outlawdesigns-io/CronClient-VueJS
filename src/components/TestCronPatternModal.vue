<template>
  <div>
    <b-modal id="testCronPatternModal" title="Test Cron Time Pattern" ok-only ok-title="Cancel">
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <b-form-group id="patternGroup" label="Pattern" label-for="patternInput" description="get next execution time for a given pattern">
          <b-form-input id="patternInput" type="text" placeholder="* 0 5 * *" v-model="form.pattern" required></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
      <div v-if="!show">
        <div v-if="!errorMsg">
          <p>Next Execution for pattern: <code>{{form.pattern}}</code></p>
          <code>{{resultStr}}</code>
        </div>
        <div v-if="errorMsg">
          <p style="color:rend">{{errorMsg}}</p>
        </div>
        <br><br>
        <b-button @click="onReset" variant="danger">Reset Form</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>

export default {
  name:'TestCronPatternModal',
  props:{},
  components:{},
  methods:{
    onSubmit(event){
      event.preventDefault();
      this.show = false;
      this.$store.dispatch('testCronPattern',this.form.pattern).catch((err)=>{
        this.errorMsg = 'Uh oh! Something went wrong. Take a close look at your pattern and try again.';
      });
    },
    onReset(event){
      event.preventDefault();
      this.show = true;
      this.$store.dispatch('emptyPatternResults');
      this.form.pattern = null;
      this.errorMsg = null;
    }
  },
  computed:{
    resultStr(){
      return this.$store.state.patternTestResults.next;
    }
  },
  data(){
    return {
      show:true,
      form:{
        pattern:null
      },
      errorMsg:null
    }
  }
}

</script>
