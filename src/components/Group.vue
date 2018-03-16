<template>
  <div class="row">
    <form class="col s12">
      <h3 class="title">Grupa</h3>
      <div class="row">
        <div class="input-field col s12">
          <input :disabled="disabled" id="name" type="text" class="validate" v-model="object.group.name">
          <label class="active" for="name">Naziv Grupe</label>
        </div>
      </div>
    </form>
    <div class="row" v-if="disabled">
      <center>
        <button v-on:click="disabled = !disabled" class="buttonClass waves-effect waves-light btn">Promjeni informacije</button>
      </center>
    </div>
    <div class="row" v-else>
      <center>
      <div class="input-field col s6">
        <button v-on:click="changeGroup" class="buttonClass waves-effect waves-light btn">Potvrdi promjenu</button>
      </div>
      <div class="input-field col s6">
        <button v-on:click="deleteGroup" class="buttonClass waves-effect waves-light btn">Izbriši grupu</button>
      </div>
    </center>
    </div>
  </div>
</template>

<script>
import session from '../Session.js'

export default {
  name: 'group',
  props: ['singleGroupObject'],
  data () {
    return {
      object: {
        group: {
          name: '',
          id: ''
        }
      },
      error: false,
      disabled: true
    }
  },
  created(){
    this.object.group.name = this.singleGroupObject.name;
    this.object.group.id = this.singleGroupObject.id;
  },
  methods:{
    changeGroup(){
      this.$http.post(this.$callHttp +'/api/v1/groups/update', this.object).then(response => {
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

    },
    deleteGroup(){
      this.$http.post(this.$callHttp +'/api/v1/groups/destroy', this.object).then(response => {
      // success callback
        this.error = false;
        return response.json();
      }, error => {
        // error callback
        if(error.status){
          alert(`error is ${error.status}`);
          if(error.status=='401')session.sessionDestroy();
          this.error = true;
        }
      }).then(data => {location.reload();});


    }
  }
}
</script>

<style scoped>
input[type="text"]:disabled {
    color: black;
}

</style>
