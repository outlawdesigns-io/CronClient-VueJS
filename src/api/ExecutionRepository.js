import Repository from './Repository';
import AppConfig from '../AppConfig';

const baseDomain = `${AppConfig[process.env.NODE_ENV].CRON_SERVICE_BASE}:${AppConfig[process.env.NODE_ENV].CRON_SERVICE_PORT}`;
// const baseDomain = process.env.NODE_ENV == 'production' ? 'https://api.outlawdesigns.io:9550':'http://localhost:9550';
const baseUrl = `${baseDomain}`;
const resource = '/execution';
export default {
  setDomain(){
    Repository.defaults.baseURL = baseUrl;
  },
  setAuthToken(auth_token){
    Repository.defaults.headers.get['auth_token'] = auth_token;
  },
  get(){
    this.setDomain();
    return Repository.get(`${resource}`);
  },
  getExecution(executionId){
    this.setDomain();
    return Repository.get(`${resource}/${executionId}`);
  },
  getLast(jobId){
    this.setDomain();
    return Repository.get(`last/${jobId}`);
  }
}
