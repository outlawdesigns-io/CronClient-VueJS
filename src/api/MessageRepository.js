import { getConfig } from '../runtime-config';
import Repository from './Repository';

const baseDomain = getConfig().MSG_SERVICE_BASE;
const resource = '/send';
export default {
  setDomain(){
    Repository.defaults.baseURL = baseDomain;
  },
  setAuthToken(auth_token){
    Repository.defaults.headers.get['Authorization'] = `Bearer ${auth_token}`;
    Repository.defaults.headers.post['Authorization'] = `Bearer ${auth_token}`;
  },
  send(message){
    this.setDomain();
    return Repository.post(`${resource}`,message);
  }
}
