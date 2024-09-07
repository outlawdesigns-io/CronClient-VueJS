import Repository from './Repository';
import AppConfig from '../AppConfig';

const baseDomain = `${AppConfig[process.env.NODE_ENV].CRON_SERVICE_BASE}:${AppConfig[process.env.NODE_ENV].CRON_SERVICE_PORT}`;
// const baseDomain = process.env.NODE_ENV == 'production' ? 'https://api.outlawdesigns.io:9550':'http://localhost:9550';
// const baseDomain = 'http://localhost:9550';
const baseUrl = `${baseDomain}`;
const resource = '/job';
export default {
  setDomain(){
    Repository.defaults.baseURL = baseUrl;
  },
  setAuthToken(auth_token){
    Repository.defaults.headers.get['auth_token'] = auth_token;
    Repository.defaults.headers.post['auth_token'] = auth_token;
  },
  get(){
    this.setDomain();
    return Repository.get(`${resource}`);
  },
  getJob(jobId){
    this.setDomain();
    return Repository.get(`${resource}/${jobId}`);
  },
  createJob(payload){
    this.setDomain();
    let formData = new FormData();
    Object.keys(payload).forEach((k)=>{ if (payload[k] !== null) formData.append(k,payload[k]) });
    return Repository.post(`${resource}`,formData,{headers:{'Content-Type':'multipart/form-data'}});
  },
  delete(jobId){
    this.setDomain();
    return Repository.delete(`${resource}/${jobId}`);
  },
  getCrontab(hostname,isImg){
    this.setDomain();
    return Repository.get(`${baseUrl}/build/${hostname}/${isImg}`);
  },
  getAvgExecutionSeconds(jobId){
    this.setDomain();
    return Repository.get(`${resource}/${jobId}/avg`);
  }
}
