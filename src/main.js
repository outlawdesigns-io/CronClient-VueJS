import Vue from 'vue'
import App from './App.vue'


import VueResource from 'vue-resource'

import {BootstrapVue, BootstrapVueIcons} from "bootstrap-vue"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// import store from './Store';
import router from './Router';
import './registerServiceWorker'
import { loadRuntimeConfig, getConfig } from './runtime-config';

Vue.use(VueResource)

Vue.config.productionTip = false
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

//vue3
/*async function bootstrap() {
  await loadRuntimeConfig();

  const app = createApp(App);
  // Inject config into store if needed
  store.runtimeConfig = config;
  app.use(store);
  app.mount('#app');
}
bootstrap();*/

async function bootstrap() {
  await loadRuntimeConfig();
  const store = await import('./Store').then(m => m.default);
  new Vue({
    render: h => h(App),
    store,
    router,
    created() {
    }
  }).$mount('#app');
}

bootstrap();
