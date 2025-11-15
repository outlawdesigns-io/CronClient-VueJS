import { getConfig } from './runtime-config';
import { createStore } from 'vuex';
import VueCookies from 'vue-cookies'
import {RepositoryFactory} from './api/RepositoryFactory';
const MessageRepository = RepositoryFactory.get('message');

import cronClient from  '@outlawdesigns/cronmonitor-rest-client';
import router from './Router';
// import cronClient from '../../CronMonitorRESTClient-JS/index.js';

console.log(getConfig());
//oauth2 config
const authUrl = getConfig().AUTH_DISCOVERY_URI;
const clientId = getConfig().AUTH_CLIENT_ID;
const apiScope = getConfig().AUTH_SCOPE;
const apiRedirectUrl = getConfig().AUTH_REDIRECT_URL;
const apiLogoutUrl = getConfig().AUTH_LOGOUT_URL;
//apis
const apiUrl = getConfig().CRON_SERVICE_BASE;
const msgUrl = getConfig().MSG_SERVICE_BASE;

cronClient.init(apiUrl,apiScope);
await cronClient.get().auth.init(authUrl,clientId);

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
  verifyToken({commit}){
    let tokenSet = VueCookies.get('oathTokenSet');
    if(tokenSet === null){
      cronClient.get().auth.authorizationCodeFlow(
        apiRedirectUrl,
        apiScope,
        [apiUrl, msgUrl]
      ).then((challengeResults)=>{
        const verifier = challengeResults.codeVerifier;
        const state = challengeResults.state;
        sessionStorage.setItem('oauth_state', state);
        sessionStorage.setItem('oauth_code_verifier', verifier);
        // console.log(challengeResults.redirectUri);
        window.location.href = challengeResults.redirectUri;
      });
    }else{
      cronClient.get().auth.verifyAccessToken(tokenSet.access_token,[apiUrl, msgUrl]).then((user)=>{
        cronClient.get().auth.setTokenSet(tokenSet);
        this.dispatch('init');
        router.push('/home');
        //console.log(AppConfig[process.env.NODE_ENV].AUTH_SCOPE);
        /*cronClient.get().auth.refreshToken(AppConfig[process.env.NODE_ENV].AUTH_SCOPE,apiUrl).then(()=>{
          VueCookies.set('oathTokenSet',cronClient.get().auth.getTokenSet(),200,'/','localhost',true,'Strict')
          this.dispatch('init');
          router.push('/home');
        }).catch((err)=>{
          console.log(err);
          throw err;
        });*/
      }).catch((err)=>{
        console.log(err);
        //if something authorizationCodeFlow.then();
        throw err;
      });
    }
  },
  swapAuthorizationCode({commit},authorizationCode){
    const state = sessionStorage.getItem('oauth_state');
    const verifier = sessionStorage.getItem('oauth_code_verifier');
    let url = new URL(window.location.href);
    if (!url.pathname.endsWith('/')) {
      url.pathname += '/';
    }
    cronClient.get().auth.completeAuthFlow(url,state,verifier).then(()=>{
      VueCookies.set('oathTokenSet',cronClient.get().auth.getTokenSet(),200,'/','localhost',true,'Strict');
      //VueCookies.set('access_token',cronClient.get().auth.getAccessToken(),200,'/','outlawdesigns.io',true,'Strict');
      // console.log(cronClient.get().auth.getAccessToken());
      this.dispatch('init');
      router.push('/home');
    });
  },
  logout(){
    //we shouldn't have to remove cookie because token should be invalidated. It's not. What's up with that?
    // VueCookies.remove('oathTokenSet');
    cronClient.get().auth.logout(apiLogoutUrl,cronClient.get().auth.getIdToken()).then((redirectUri)=>{
      window.location.href = redirectUri;
    });
  },
  devInit({commit}){
    cronClient.get().auth.setTokenSet({access_token:'12345678'});
    this.dispatch('init');
    router.push('/home');
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
    MessageRepository.setAuthToken(cronClient.get().auth.getAccessToken());
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
export default createStore({
  state,
  actions,
  mutations
});
