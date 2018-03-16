<template>
  <div class="row">
    <form class="col s12">
      <h3 class="title">Nova grupa</h3>
      <div class="row">
        <div class="input-field col s12">
          <input id="name" type="text" class="validate" v-model="object.group.name">
          <label for="name">Naziv Grupe</label>
        </div>
      </div>
    </form>
    <center>
      <button class="btn waves-effect waves-light teal" v-on:click="createNewGroup" >Kreiraj novu grupu</button>
    </center>
  </div>
</template>

<script>
import session from '../Session.js'

export default {
  data(){
    return{
      error: false,
      object: {
        group: {
          name: ''
        }
      }
    }
  },
  methods: {
    createNewGroup(){
      this.$http.post(this.$callHttp +'/api/v1/groups/create', this.object).then(response => {
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
        //obrada podataka
        if(data.status=='401')session.sessionDestroy();
        location.reload();
      });

    }
  }
}
</script>

<style lang="css">
</style>
