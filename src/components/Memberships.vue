<template lang="html">
<div class="memberships">
  <appNavbar></appNavbar>
  <loader v-if="loading.memberships"></loader>
  <template v-else>
  <div class="row">
    <div class="col s3">
      <br />
      <center>
          <button type="button" class="btn waves-effect waves-light teal" name="action" v-on:click="createMembership()">Kreiraj novu vrstu članarine</button>
      </center>
    </div>
    <div class="col s9">
      <table id="customers">
      <tr>
        <th>Naziv članarine</th>
        <th>Broj dolazaka</th>
        <th>Sati restrikcija</th>
      </tr>
      <tr class="list-group-item" style="cursor: pointer;" v-for="membership in memberships"  :key="membership.id">
        <td v-on:click="seeMembership(membership.id)" >{{membership.name}}</td>
        <td v-on:click="seeMembership(membership.id)" >{{membership.max_week_attendance_restriction}}</td>
        <td v-on:click="seeMembership(membership.id)" >{{membership.after_hour_restriction}}</td>
      </tr>
    </table>
    </div>
  </div>
  <modal name="createMembershipModal" :scrollable="true" :draggable="true" height="auto">
    <appNewMembership></appNewMembership>
  </modal>
  <modal name="singleMembership" :scrollable="true" :draggable="true" height="auto">
    <appSingleMembership :singleMembershipObject="singleMembershipObj"></appSingleMembership>
  </modal>
  </template>
</div>

</template>

<script>
import Loader from './Loader.vue'
import Navbar from './Navbar.vue'
import NewMembership from './NewMembership.vue'
import SingleMembership from './SingleMembership.vue'
import moment from 'moment'
import session from '../Session.js'
export default {
  name: 'memberships',
  data(){
    return{
      error: false,
      memberships: [],
      singleMembershipObj: {},
      loading:{
        memberships: false
      }
    }
  },
  created(){
    //dohvacanje svih članarina
    this.loading.memberships = true;
    this.$http.get('https://gym-management-system-cc.herokuapp.com/api/v1/membership_types/index').then(response => {
      // success callback
      this.loading.memberships = false;
      return response.json();
    }, error => {
      // error callback
      if(error.status){
        console.log(`Došlo je do pogreške ${error.status}`);
        this.error = true;
      }
    }).then(data => {
      if(data.status=='401')session.sessionDestroy();
      //obrada podataka
      var self = this;
      //this.memberships= data.membership_types;
      data.membership_types.forEach(function(el){
        let obj={
          id: el.id,
          name: el.name,
          max_week_attendance_restriction: el.max_week_attendance_restriction,
          after_hour_restriction: moment(el.after_hour_restriction).format('HH:mm')
        }
        self.memberships.push(obj);
      });
    });


  },
  methods:{
    createMembership(){
      this.$modal.show('createMembershipModal');
    },
    seeMembership(id){
      var self = this;
      this.memberships.forEach(function(x) {
        if(x.id==id){
          self.singleMembershipObj=x;
        }
      });
      this.$modal.show('singleMembership');
    }
  },
  components: {
    Loader,
    appNavbar: Navbar,
    appNewMembership: NewMembership,
    appSingleMembership: SingleMembership
  }
}
</script>

<style lang="css">
.ej{
  color: red !important;
}
#customers {
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
}

#customers td, #customers th {
    border: 1px solid #ddd;
    padding: 8px;
}

#customers tr:nth-child(even){background-color: #f2f2f2;}

#customers tr:hover {background-color: #ddd;}

#customers th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #43C69C;
    color: white;
}
</style>
