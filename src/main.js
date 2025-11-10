import { createApp } from 'vue'
import App from './App.vue'

import router from './Router';
import './registerServiceWorker';
import { loadRuntimeConfig, getConfig } from './runtime-config';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'


async function bootstrap() {
  await loadRuntimeConfig();
  //import store here so config is populated before store tries to access it.
  const store = await import('./Store').then(m => m.default);
  const app = createApp(App).use(router).use(store).mount('#app');
}
bootstrap();
