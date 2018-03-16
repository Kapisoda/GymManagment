<template lang="html">
  <div class="row">
    <form class="col s12">
      <h3 class="title">Nova članarina</h3>
      <div class="row">
        <div class="input-field col s12">
          <input id="name" type="text" class="validate" v-model="object.membership_type.name">
          <label for="name">Naziv članarine</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input id="max_week_attendance_restriction" type="text" class="validate" v-model="object.membership_type.max_week_attendance_restriction">
          <label for="max_week_attendance_restriction">Broj dolazaka</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input id="after_hour_restriction" type="time" class="validate" v-model="object.membership_type.after_hour_restriction">
          <label  class="active" for="after_hour_restriction">Sati restrikcija</label>
        </div>
      </div>
    </form>
    <center>
      <button class="btn waves-effect waves-light teal" v-on:click="createNewMembership" >Kreiraj novu članarinu</button>
    </center>
  </div>
</template>

<script>
import session from '../Session.js'
import moment from 'moment'
export default {
 data(){
   return {
     error: false,
     object: {
       membership_type:{
         name: '',
         max_week_attendance_restriction: '',
         after_hour_restriction: ''
       }
     }
   }
 },
 methods: {
   timeRestriction(){
     this.object.membership_type.after_hour_restriction=moment(this.object.membership_type.after_hour_restriction).format(',HH:MM');
   },
   createNewMembership(){
     if(this.object.membership_type.after_hour_restriction == ''){
       let timeStr = "23:59";
       this.object.membership_type.after_hour_restriction = moment(timeStr, 'HH:mm');
     };
      if(this.object.membership_type.max_week_attendance_restriction == ''){
        this.object.membership_type.max_week_attendance_restriction = 999;
      };
     this.$http.post(this.$callHttp +'/api/v1/membership_types/create', this.object).then(response => {
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
 }
}
</script>

<style lang="css">
</style>
