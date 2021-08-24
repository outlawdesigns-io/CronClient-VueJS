import Vue from 'vue'
import App from './App.vue'


import VueResource from 'vue-resource'

import BootstrapVue from "bootstrap-vue"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import store from './Store';
import router from './Router';

Vue.use(VueResource)


Vue.config.productionTip = false
Vue.use(BootstrapVue);


new Vue({
  render: h => h(App),
  store:store,
  router:router,
  created(){
    this.$store.dispatch('verifyToken',{auth_token:this.$cookies.get('auth_token')})
    //this.$store.dispatch('getJobs');
  }
}).$mount('#app')
