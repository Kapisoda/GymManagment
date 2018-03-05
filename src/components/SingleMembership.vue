<template>

  <div class="row">
    <form class="col s12">
      <h3 class="title">Članarina</h3>
      <div class="row">
        <div class="input-field col s12">
          <input :disabled="disabled" id="name" type="text" class="validate" v-model="object.membership_type.name">
          <label class="active" for="name">Naziv članarine</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input :disabled="disabled" id="tj" type="text" class="validate" v-model="object.membership_type.max_week_attendance_restriction">
          <label class="active" for="tj">Broj dolazaka</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input :disabled="disabled" id="sati" type="time" class="validate" v-model="object.membership_type.after_hour_restriction">
          <label class="active" for="sati">Sati restrikcija</label>
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
        <button v-on:click="changeMembership" class="buttonClass waves-effect waves-light btn">Potvrdi promjenu</button>
      </div>
      <div class="input-field col s6">
        <button v-on:click="deleteMembership" class="buttonClass waves-effect waves-light btn">Izbriši Članarinu</button>
      </div>
    </center>
    </div>
  </div>
</template>

<script>
import session from '../Session.js'

export default {
  props: ['singleMembershipObject'],
  data(){
    return {

      object: {
        membership_type: {
          id: '',
          name: '',
          max_week_attendance_restriction: '',
          after_hour_restriction: ''
        }
      },
      disabled: true,
      error: false
    }
  },
  methods:{
    changeMembership(){
      this.$http.post('https://gym-management-system-cc.herokuapp.com/api/v1/membership_types/update', this.object).then(response => {
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
        this.object.membership_type = data.membership_type
        location.reload();
      });

    },
    deleteMembership(){
      this.$http.post('https://gym-management-system-cc.herokuapp.com/api/v1/membership_types/destroy', this.object).then(response => {
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
  },
  created() {
    this.object.membership_type = this.singleMembershipObject;
  }
}
</script>

<style scoped>

input[type="text"]:disabled {
    color: black;
}
</style>
