<template lang="html">
  <div class="row">
    <form class="col s12">
      <h3 class="title">Nova poruka</h3>
      <div class="row">
        <div class="input-field col s12">
          <textarea rows="8" cols="40" v-model="object.note.body"></textarea>
        </div>
      </div>
    </form>
    <center>
      <button class="btn waves-effect waves-light teal" v-on:click="createNewNote" >Kreiraj novu poruku</button>
    </center>
  </div>

</template>

<script>
import session from '../Session.js'
import moment from 'moment'
export default {
  data(){
    return{
      object: {
        note: {
          body: '',
          author: ''
        }
      },
      error: false
    }
  },
  methods:{
    createNewNote(){
      this.object.note.author = session.getSessionUsername()+' - '+moment().format('DD.MM.YYYY');
      //this.object.note.body += ;
      this.$http.post(this.$callHttp +'/api/v1/notes/create', this.object).then(response => {
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
        location.reload();
      });

    }
  },
  destroyed(){
    this.$emit('interface', true);
  }
}
</script>

<style lang="css">
</style>
