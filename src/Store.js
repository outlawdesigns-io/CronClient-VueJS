import Vue from 'vue'
import Vuex from 'vuex'
import VueCookies from 'vue-cookies'
import {RepositoryFactory} from './api/RepositoryFactory';
const JobRepository = RepositoryFactory.get('jobs');
const ExecRepository = RepositoryFactory.get('executions');
const AuthRepository = RepositoryFactory.get('authorization');
const MessageRepository = RepositoryFactory.get('message');

import router from './Router';

Vue.use(Vuex);

const state = {
  data:null,
  auth_token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpcCI6IjE5Mi4xNjguODguMTc2IiwidXNlcm5hbWUiOiJvdXRsYXciLCJsYXQiOm51bGwsImxvbmciOm51bGwsInNhbHQiOjQ4MX0.1xjinl3qOslU3raVRVMNeRCWC9xZsnlmlvmrf2RV_8Y',
  jobs:[],
  sendOutputModalData:{},
  sendMessageResponse:null
}
// const getters = {};
const actions = {
  authenticate({commit},payload){
    AuthRepository.authenticate(payload.username,payload.password).then((response)=>{
      console.log(response.data);
      if(!response.data['error']){
        commit('setAuthToken',response.data.token);
        this.dispatch('getJobs');
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
    });
  },
  getJobs(){
    JobRepository.setAuthToken(this.state.auth_token);
    return JobRepository.get().then((response)=>{
      response.data.forEach((job)=>{
        this.dispatch('getLastExecution',job);
      });
    });
  },
  getLastExecution({commit},job){
    ExecRepository.setAuthToken(this.state.auth_token);
    return ExecRepository.getLast(job.id).then((response)=>{
      if(!response.data['error']){
        job.lastExecution = response.data;
        commit('addJob',job);
      }else if(response.data['error'] == 'No Execution History'){
        commit('addJob',job);
      }else{
        throw new Error(`API ${response.data.error}`);
      }
    });
  },
  createJob({commit},job){
    JobRepository.setAuthToken(this.state.auth_token);
    return JobRepository.createJob(job).then((response)=>{
      if(!response.data['error']){
        commit('addJob',response.data);
      }else{
        throw new Error(`API ${response.data.error}`);
      }
    });
  },
  populateSendOutputModal({commit},job){
    commit('setSendOutputModalData',job);
  },
  mailOutput({commit},message){
    MessageRepository.setAuthToken(this.state.auth_token);
    return MessageRepository.send(message).then((response)=>{
      if(!response.data['error']){
        commit('setMessageResponse',response.data);
      }else{
        throw new Error(`API ${response.data.error}`);
      }
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
  },
  setSendOutputModalData(state,job){
    state.sendOutputModalData = job;
  },
  setMessageResponse(state,response){
    state.sendMessageResponse = response;
  }
}
export default new Vuex.Store({
  state,
  actions,
  mutations
});
