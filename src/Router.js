// import Vue from 'vue';
// import Router from 'vue-router';
// import VueCookies from 'vue-cookies'
import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import AuthCallBackHandler from './components/AuthCallBackHandler.vue'

// import store from './Store';

// Vue.use(Router);
// Vue.use(VueCookies)

const router = createRouter({
  mode:'history',
  base: import.meta.env.BASE_URL,
  history: createWebHistory(import.meta.env.BASE_URL),
  linkExactActiveClass:'active',
  routes:[
    {path:'/',component:Login},
    {path:'/home',component:Home},
    {path:'/token',component:AuthCallBackHandler},
    {path:'/logout',component:Login}
  ]
});

export default router;
