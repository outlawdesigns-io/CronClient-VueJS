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
  auth_token:null,
  jobs:[],
  sendOutputModalData:{},
  sendMessageResponse:null,
  crontab:null
}
// const getters = {};
const actions = {
  init(){
    this.dispatch('getJobs');
  },
  authenticate({commit},payload){
    AuthRepository.authenticate(payload.username,payload.password).then((response)=>{
      if(!response.data['error']){
        commit('setAuthToken',response.data.token);
        this.dispatch('init');
        router.push('home');
      }else{
        throw new Error(`API ${response.data['error']}`);
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
          this.dispatch('init');
          router.push('home');
        }
      }else{
        router.push('/');
        //console.log(response.data);
      }
    });
  },
  devInit({commit}){
    commit('setAuthToken',12345);
    this.dispatch('init');
    router.push('home');
  },
  getJobs(){
    JobRepository.setAuthToken(this.state.auth_token);
    return JobRepository.get().then((response)=>{
      response.data.forEach((job)=>{
        this.dispatch('getLastExecution',job);
      });
    });
  },
  getJob({commit},jobId){
    JobRepository.setAuthToken(this.state.auth_token);
    return JobRepository.getJob(jobId).then((response)=>{
      this.dispatch('getLastExecution',response.data);
    });
  },
  getLastExecution({commit},job){
    ExecRepository.setAuthToken(this.state.auth_token);
    return ExecRepository.getLast(job.id).then((response)=>{
      if(!response.data['error']){
        job.lastExecution = response.data;
        this.dispatch('getAvgExecutionSeconds',job);
        // commit('addJob',job);
      }else if(response.data['error'] == 'No Execution History'){
        this.dispatch('getAvgExecutionSeconds',job);
        // commit('addJob',job);
      }
      else{
        throw new Error(`API ${response.data.error}`);
      }
    });
  },
  getAvgExecutionSeconds({commit},job){
    JobRepository.setAuthToken(this.state.auth_token);
    return JobRepository.getAvgExecutionSeconds(job.id).then((response)=>{
      if(!response.data['error']){
        job.avgExecutionSeconds = response.data.avg_execution_seconds;
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
  },
  getCrontab({commit},payload){
    JobRepository.setAuthToken(this.state.auth_token);
    return JobRepository.getCrontab(payload.hostname,payload.isImg).then((response)=>{
      if(!response.data['error']){
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'crontab');
        document.body.appendChild(link);
        link.click();
        commit('setCrontab',response.data);
      }else{
        throw new Error(`API ${response.data.error}`);
      }
      console.log(response);
    }).catch((err)=>{
      throw new Error(`API ${err}`);
    });
  },
  emptyCrontab({commit}){
    commit('emptyCrontab');
  }
};
const mutations = {
  setAuthToken(state,token){
    //set auth_token cookie here
    VueCookies.set('auth_token',token,'4h');
    state.auth_token = token;
  },
  addJob(state,job){
    let targetIndex = state.jobs.findIndex((e)=>{ return e.id == job.id });
    if(targetIndex === -1){
      state.jobs.push(job);
    }else{
      state.jobs.splice(targetIndex,1,job);
      //state.jobs[targetIndex] = job;
    }
  },
  setSendOutputModalData(state,job){
    state.sendOutputModalData = job;
  },
  setMessageResponse(state,response){
    state.sendMessageResponse = response;
  },
  setCrontab(state,response){
    state.crontab = response;
  },
  emptyCrontab(state){
    state.crontab = null;
  }
}
export default new Vuex.Store({
  state,
  actions,
  mutations
});
