<template>
  <form enctype="text/plain">
    <loader v-if="sendMailLoader"></loader>
    <template v-else>
    <div class="row">
      <center>
        <h3 class="title">Email</h3>
      </center>
    </div>
    <div class="row">
      <div class="col s12">
        <label for="subjekt">Subjekt</label>
        <input id="subjekt" type="text" class="validate" v-model="object.mail.subject">
      </div>
    </div>
    <div class="row">
      <div class="col s12">
        <label class="active" for="message">Poruka</label>
        <textarea wrap="off" rows="50" cols="40" v-model="object.mail.body"></textarea>
      </div>
    </div>
    <div class="row">
      <div class="col s12">
      <center>
          <button type="button" class="btn waves-effect waves-light teal" name="action" v-on:click="sendMail">Pošalji mail <i class="fa fa-envelope-o"></i></button>
      </center>
    </div>
  </div>
</template>
</form>

</template>

<script>
import session from '../Session.js'
import Loader from './Loader.vue'
export default {
    name: 'email',
    props:['usersForSendingMail'],
    data(){
    return {
      subject: '',
      message: '',
      error: false,
      object: {
        mail: {
          subject: '',
          body: '',
          user_ids: []
        }
      },
      sendMailLoader: false
    }
  },
  methods:{
    sendMail(){
      this.sendMailLoader = true;
      this.$http.post('https://gym-management-system-cc.herokuapp.com/api/v1/mails/create', this.object).then(response => {
      // success callback

        return response;
      }, error => {
        // error callback
        if(error.status){
          console.log(`error is ${error.status}`);
          this.error = true;
        }
      }).then(data => {
        this.sendMailLoader = false;
        //if(data.status=='401')session.sessionDestroy();
        //obrada podataka
        location.reload();
      });
    }
  },
  created(){
    this.object.mail.user_ids = this.usersForSendingMail;
  },
  components:{
    Loader
  }
}

</script>

<style>
.message_text{
  height:200px;
}
</style>
