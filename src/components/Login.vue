<template lang="html">
  <div class="loginBackground">
  <div class="container white z-depth-2">
    <div id="login" class="col s12">
      <form class="col s12">
        <div class="form-container">
          <center>
            <h3 class="teal-text">PRIJAVA</h3>
          </center>
          <div class="row" v-if="errorLogin != ''">
            <div class="col s12">
              <div class="error-login">
                  <p><strong>Oprez!</strong> {{errorLogin}}</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input id="username" type="text" class="validate" v-model="object.admin.username">
              <label  for="username">Korisničko ime</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input id="password" type="password" class="validate" v-model="object.admin.password">
              <label  for="password">Lozinka</label>
            </div>
          </div>
          <center>
            <p v-if="error!=false" class="error-login">Pogrešno korisničko ime ili lozinka</p>
          </center>
          <br>
          <center>
            <button type="button" class="btn waves-effect waves-light teal" name="action" v-on:click="login_user()">Prijavi se</button>
            <br>
          </center>
        </div>
      </form>
    </div>
  </div>
</div>
</template>

<script>
import Api from '../Api.js'
import session from '../Session.js'

export default {
  name: 'login',
  data () {
    return {
      object: {
      admin : {
        username: "",
        password: ""
      }},
      error: false,
      isActive: true,
      errorLogin: ''
    }
  },
  methods: {
      login_user(){
        let check = false;
      this.$http.post('https://gym-management-system-cc.herokuapp.com/api/v1/sessions/create', this.object).then(response => {
        // success callback
        this.error = false;
        return response.json();
      }, error => {
        // error callback
        if(error.status){
          console.log(`error is ${error.status}`);
          this.error = true;
      }
      }).then(data => {
        if(data.status=='401')session.sessionDestroy();
        //obrada podataka
        if(data.notice){
          this.errorLogin = data.notice.detail;
        }else{ //if (!this.error)

          session.setSession(data.admin.username, data.admin.auth_token);
          //window.sessionStorage.setItem('token', data.admin.auth_token);
          this.$router.push({ path: '/home'});
        }
      });
    }
  }
}
</script>

<style lang="css" scoped>
  @import '../assets/login.scss'
</style>
