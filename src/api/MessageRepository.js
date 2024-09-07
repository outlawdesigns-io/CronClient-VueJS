import Repository from './Repository';
import AppConfig from '../AppConfig';

// const baseDomain = 'https://api.outlawdesigns.io:9667';
const baseDomain = `${AppConfig[process.env.NODE_ENV].MSG_SERVICE_BASE}:${AppConfig[process.env.NODE_ENV].MSG_SERVICE_PORT}`;
const baseUrl = `${baseDomain}`;
const resource = '/send';
export default {
  setDomain(){
    Repository.defaults.baseURL = baseUrl;
  },
  setAuthToken(auth_token){
    Repository.defaults.headers.get['auth_token'] = auth_token;
    Repository.defaults.headers.post['auth_token'] = auth_token;
  },
  send(message){
    this.setDomain();
    return Repository.post(`${resource}`,message);
  }
}
