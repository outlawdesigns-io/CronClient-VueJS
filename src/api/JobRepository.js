import Repository from './Repository';

const baseDomain = 'https://api.outlawdesigns.io:9550';
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
  }
}
