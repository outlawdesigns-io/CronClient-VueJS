import Vue from 'vue';
import Router from 'vue-router';
import VueCookies from 'vue-cookies'

import Login from './components/Login'
import Home from './components/Home'

// import store from './Store';

Vue.use(Router);
Vue.use(VueCookies)

const router = new Router({
  mode:'hash',
  base: process.env.BASE_URL + 'cron/',
  linkExactActiveClass:'active',
  routes:[
    {path:'/',component:Login},
    {path:'/home',component:Home}
  ]
});

// router.beforeEach(async(to,from,next)=>{
//   store.dispatch('verifyToken',{auth_token:this.$cookies.get('auth_token')})
//   next();
// });

export default router;
