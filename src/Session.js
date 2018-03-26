import Vue from 'vue'
import VueSession from 'vue-session'


Vue.use(VueSession)
var sessionJar = new Vue();

var SessionService = {

  setSession (username, auth_token){
    sessionJar.$session.set('username', username);
    sessionJar.$session.set('auth_token', auth_token);
  },
  getSessionUsername (){
    return sessionJar.$session.get('username') || false
  },
  getSessionAuth_token (){
    return sessionJar.$session.get('auth_token') || false
  },
  sessionExists(){
    return sessionJar.$session.exists() ? true : false
  },
  sessionDestroy(){
    sessionJar.$session.destroy();
    location.reload();
  },
  setUsers (users){
    sessionJar.$session.set('users', users);
  },
  getUsers (){
    return sessionJar.$session.get('users') || false
  },
}

export default SessionService
