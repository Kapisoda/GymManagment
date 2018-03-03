import Vue from 'vue'
import Router from 'vue-router'

import session from '@/Session.js'

import Login from '@/components/Login.vue'
import Users from '@/components/Users.vue'
import Groups from '@/components/Groups.vue'
import Group from '@/components/Group.vue'
import SingleUser from '@/components/SingleUser.vue'
import Email from '@/components/Email.vue'
import Memberships from '@/components/Memberships.vue'
import Home from '@/components/Home'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    { path: '/login',
       name: 'login',
       components: {default: Login}
     },
     {
       path: '/users',
       name: 'users',
       components: {default: Users}
     },
     {
       path: '/user/:id',
       name: 'singleUser',
       components: {default: SingleUser}
     },
     {
       path: '/groups',
       name: 'groups',
       components: {default: Groups}
     },
     {
       path: '/group/:id',
       name: 'group',
       components: {default: Group}
     },
     {
       path: '/email',
       name: 'email',
       components: {default: Email}
     },
     {
       path: '/memberships',
       name: 'memberships',
       components: {default: Memberships}
     },
    {
      path: '/home',
      name: 'home',
      components: {default: Home}
    }
  ]
});

router.beforeEach((to, from, next) => {
  //console.log('In before each')
  console.log(session.getSessionAuth_token());
  if (to.path == '/login'){
    next()
  }else if (!session.getSessionAuth_token()){ // !window.sessionStorage.getItem('token')
    next({ path: '/login' })
  } else {
    next()
  }
})
export default router
