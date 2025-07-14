import Vue from 'vue';
import Router from 'vue-router';
import VueCookies from 'vue-cookies'

import Login from './components/Login.vue'
import Home from './components/Home.vue'
import AuthCallBackHandler from './components/AuthCallBackHandler.vue'

// import store from './Store';

Vue.use(Router);
Vue.use(VueCookies)

const router = new Router({
  mode:'history',
  base: import.meta.env.BASE_URL + 'cron/',
  linkExactActiveClass:'active',
  routes:[
    {path:'/',component:Login},
    {path:'/home',component:Home},
    {path:'/token',component:AuthCallBackHandler}
  ]
});

// router.beforeEach(async(to,from,next)=>{
//   store.dispatch('verifyToken',{auth_token:this.$cookies.get('auth_token')})
//   next();
// });

export default router;
