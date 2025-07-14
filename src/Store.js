import AppConfig from './AppConfig';
import Vue from 'vue'
import Vuex from 'vuex'
import VueCookies from 'vue-cookies'
import {RepositoryFactory} from './api/RepositoryFactory';
const MessageRepository = RepositoryFactory.get('message');

// import cronClient from  '@outlawdesigns/cronmonitor-rest-client';

import cronClient from '../../CronMonitorRESTClient-JS/index.js';

const authUrl = `${AppConfig[process.env.NODE_ENV].AUTH_DISCOVERY_URI}`;
const clientId = `${AppConfig[process.env.NODE_ENV].AUTH_CLIENT_ID}`;
const apiUrl = `${AppConfig[process.env.NODE_ENV].CRON_SERVICE_BASE}:${AppConfig[process.env.NODE_ENV].CRON_SERVICE_PORT}`;

cronClient.init(apiUrl);
await cronClient.get().auth.init(new URL(authUrl),clientId);

import router from './Router';

Vue.use(Vuex);

const state = {
  isAuthenticated:false,
  data:null,
  jobs:[],
  events:[],
  eventSubscriptions:[],
  sendOutputModalData:{},
  sendMessageResponse:null,
  crontab:null,
  patternTestResults:{
    pattern:null,
    next:null,
  }
}
// const getters = {};
const actions = {
  init({commit}){
    commit('setIsAuthenticated',true);
    this.dispatch('getEvents');
    this.dispatch('getEventSubscriptions');
    this.dispatch('getJobs');
  },
  authenticate({commit},payload){
    cronClient.get().auth.authenticate(payload.username,payload.password).then((auth_token)=>{
      VueCookies.set('auth_token',auth_token,200,'/','outlawdesigns.io',true,'Strict');
      this.dispatch('init');
      router.push('home');
    }).catch((err)=>{
      throw new Error(`API ${err.error}`);
    });
  },
  verifyToken({commit}){
    let accessToken = VueCookies.get('auth_token');
    if(accessToken === null){
      cronClient.get().auth.authorizationCodeFlow('http://localhost:3000/token/','').then((challengeResults)=>{
        const verifier = challengeResults.codeVerifier;
        const state = challengeResults.state;
        sessionStorage.setItem('oauth_state', state);
        sessionStorage.setItem('oauth_code_verifier', verifier);
        window.location.href = challengeResults.redirectUri;
        // console.log(challengeResults.redirectUri);
      });
    }//else if expired, refresh?
    /*
    this.dispatch('init');
    router.push('home');
    */
  },
  swapAuthorizationCode({commit},authorizationCode){
    const state = sessionStorage.getItem('oauth_state');
    const verifier = sessionStorage.getItem('oauth_code_verifier');
    let url = new URL(window.location.href);
    if (!url.pathname.endsWith('/')) {
      url.pathname += '/';
    }
    cronClient.get().auth.authorizationCodeToAccessToken(url,sessionStorage.getItem('oauth_state'),sessionStorage.getItem('oauth_code_verifier')).then(()=>{
      router.push('home');
    });
  },
  devInit({commit}){
    cronClient.get().auth.setAuthToken('12345');
    this.dispatch('init');
    router.push('home');
  },
  getJobs(){
    return cronClient.get().jobs.getAll().then((response)=>{
      response.forEach((job)=>{
        this.dispatch('getLastExecution',job);
      });
    });
  },
  getJob({commit},jobId){
    return cronClient.get().jobs.get(jobId).then((response)=>{
      this.dispatch('getLastExecution',response);
    });
  },
  getLastExecution({commit},job){
    return cronClient.get().executions.last(job.id).then((response)=>{
      if(!response.error){
        job.lastExecution = response;
        this.dispatch('getAvgExecutionSeconds',job);
        // commit('addJob',job);
      }else if(response?.error == 'No Execution History'){
        this.dispatch('getAvgExecutionSeconds',job);
        // commit('addJob',job);
      }
      else{
        throw new Error(`API ${response.error}`);
      }
    });
  },
  getAvgExecutionSeconds({commit},job){
    return cronClient.get().jobs.getAvgExecution(job.id).then((response)=>{
      if(!response.error){
        job.avgExecutionSeconds = response.avg_execution_seconds;
        commit('addJob',job);
      }else{
        throw new Error(`API ${response.error}`);
      }
    });
  },
  getNextExecution({commit},job){
    return cronClient.get().executions.next(job.id).then((response)=>{
      job.nextRun = response.next;
      this.dispatch('getLastExecution',job);
    });
  },
  createJob({commit},job){
    return cronClient.get().jobs.create(job).then((response)=>{
      if(!response.error){
        commit('addJob',response);
      }else{
        throw new Error(`API ${response.error}`);
      }
    });
  },
  deleteJob({commit},jobId){
    return cronClient.get().jobs.delete(jobId).then((response)=>{
      if(!response.error){
        commit('deleteJob',jobId);
      }else{
        throw new Error(`API ${response.error}`);
      }
    });
  },
  disableJob({commit},jobId){
    return cronClient.get().jobs.update(jobId,{disabled:1}).then((response)=>{
      if(!response.error){
        commit('addJob',response);
      }else{
        throw new Error(`API ${response.error}`);
      }
    });
  },
  enableJob({commit},jobId){
    return cronClient.get().jobs.update(jobId,{disabled:0}).then((response)=>{
      if(!response.error){
        this.dispatch('getJob',jobId);
      }else{
        throw new Error(`API ${response.error}`);
      }
    });
  },
  getEvents({commit}){
    return cronClient.get().events.getAll().then((response)=>{
      response.forEach((e)=>{
        commit('addEvent',e);
      });
    });
  },
  getEventSubscriptions({commit}){
    return cronClient.get().subscriptions.getAll().then((response)=>{
      response.forEach((e)=>{
        commit('addSubscription',e);
      });
    });
  },
  createEvenSubscription({commit},payload){
    return cronClient.get().subscriptions.create(payload).then((response)=>{
      commit('addSubscription',response);
    });
  },
  updateEventSubscription({commit},payload){
    return cronClient.get().subscriptions.update(payload.id,payload).then((response)=>{
      commit('updateSubscription',response);
    });
  },
  deleteEventSubscription({commit},id){
    return cronClient.get().subscriptions.delete(id).then((response)=>{
      commit('deleteSubscription',id);
    });
  },
  populateSendOutputModal({commit},job){
    commit('setSendOutputModalData',job);
  },
  mailOutput({commit},message){
    MessageRepository.setAuthToken(this.cronClient.get().getAuthToken());
    return MessageRepository.send(message).then((response)=>{
      if(!response.data['error']){
        commit('setMessageResponse',response.data);
      }else{
        throw new Error(`API ${response.data.error}`);
      }
    });
  },
  getCrontab({commit},payload){
    return cronClient.get().jobs.getCrontab(payload.hostname,payload.isImg).then((response)=>{
      if(!response.error){
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'crontab');
        document.body.appendChild(link);
        link.click();
        commit('setCrontab',response);
      }else{
        throw new Error(`API ${response.error}`);
      }
    }).catch((err)=>{
      throw new Error(`API ${err}`);
    });
  },
  emptyCrontab({commit}){
    commit('emptyCrontab');
  },
  testCronPattern({commit},payload){
    return cronClient.get().executions.nextPattern(payload).then((response)=>{
      commit('setPatternResults',response);
    }).catch((err)=>{
      throw new Error(`API ${err}`);
    });
  },
  emptyPatternResults({commit}){
    commit('emptyPatternResults');
  }
};
const mutations = {
  setIsAuthenticated(state,isAuthBool){
    state.isAuthenticated = isAuthBool;
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
  addEvent(state,event){
    state.events.push(event);
  },
  addSubscription(state,eventSubscription){
    state.eventSubscriptions.push(eventSubscription);
  },
  deleteJob(state,jobId){
    let targetIndex = state.jobs.findIndex((e)=>{ return e.id == jobId });
    state.jobs.splice(targetIndex,1);
  },
  updateSubscription(state,eventSubscription){
    let targetIndex = state.eventSubscriptions.findIndex(e => e.id == eventSubscription.id);
    state.eventSubscriptions.splice(targetIndex,1,eventSubscription);
  },
  deleteSubscription(state,id){
    let targetIndex = state.eventSubscriptions.findIndex((e)=>{ return e.id == id});
    state.eventSubscriptions.splice(targetIndex,1);
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
  },
  setPatternResults(state,responseObj){
    state.patternTestResults = responseObj;
  },
  emptyPatternResults(state){
    state.patternTestResults.pattern = null;
    state.patternTestResults.next = null;
  }
}
export default new Vuex.Store({
  state,
  actions,
  mutations
});
