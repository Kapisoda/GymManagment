import Vue from 'vue'
import VueResource from 'vue-resource';
import session from './Session.js'
Vue.use(VueResource);

Vue.http.interceptors.push((request, next)=>{
  request.headers.set('Authorization', 'Token token='+session.getSessionAuth_token()+', identifier='+session.getSessionUsername())
  request.headers.set('Content-Type', 'application/json')
    next()
});
