import Vue from 'vue'
import Vuex from 'vuex'
import VueCookies from 'vue-cookies'
import {RepositoryFactory} from './api/RepositoryFactory';
const JobRepository = RepositoryFactory.get('jobs');
const ExecRepository = RepositoryFactory.get('executions');
const AuthRepository = RepositoryFactory.get('authorization');

import router from './Router';

Vue.use(Vuex);

const state = {
  data:null,
  auth_token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpcCI6IjE5Mi4xNjguODguMTc2IiwidXNlcm5hbWUiOiJvdXRsYXciLCJsYXQiOm51bGwsImxvbmciOm51bGwsInNhbHQiOjQ4MX0.1xjinl3qOslU3raVRVMNeRCWC9xZsnlmlvmrf2RV_8Y',
  jobs:[],
}
// const getters = {};
const actions = {
  authenticate({commit},payload){
    AuthRepository.authenticate(payload.username,payload.password).then(function(response){
      if(!response.data['error']){
        commit('setAuthToken',response.data.token);
        router.push('home');
      }else{
        console.log(response.data);
      }
    }).catch((err)=>{
      throw new Error(`API ${err}`);
    });
  },
  verifyToken({commit},payload){
    AuthRepository.verify(payload.auth_token).then((response)=>{
      if(!response.data['error']){
        commit('setAuthToken',response.data.auth_token);
        if(router.currentRoute.path == '/'){
          this.dispatch('getJobs');
          router.push('home');
        }
      }else{
        router.push('/');
        console.log(response.data);
      }
    }).catch((err)=>{
      throw new Error(`API ${err}`);
    });
  },
  getJobs(){
    JobRepository.setAuthToken(this.state.auth_token);
    JobRepository.get().then((response)=>{
      response.data.forEach((job)=>{
        console.log(job.id);
        this.dispatch('getLastExecution',job);
      });
    }).catch((err)=>{
      throw new Error(`API ${err}`);
    });
  },
  getLastExecution({commit},job){
    ExecRepository.setAuthToken(this.state.auth_token);
    ExecRepository.getLast(job.id).then((response)=>{
      if(!response.data['error']){
        job.lastExecution = response.data;
        commit('addJob',job);
      }
    }).catch((err)=>{
      throw new Error(`API ${err}`);
    });
  }
};
const mutations = {
  setAuthToken(state,token){
    //set auth_token cookie here
    VueCookies.set('auth_token',token,'4h');
    state.auth_token = token;
  },
  addJob(state,job){
    state.jobs.push(job);
  }
}
export default new Vuex.Store({
  state,
  actions,
  mutations
});
