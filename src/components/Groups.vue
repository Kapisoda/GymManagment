<template>
  <div class="groups">
    <appNavbar></appNavbar>
    <loader v-if="loading.groups"></loader>
    <template v-else>
    <div class="row">
      <div class="col s3">
        <br />
        <center>
            <button type="button" class="btn waves-effect waves-light teal" name="action" v-on:click="createGroup">Kreiraj novu grupu</button>
        </center>
      </div>
      <div class="col s9">
        <table id="customers">
        <tr>
          <th>Naziv grupe</th>
        </tr>
        <tr class="list-group-item" style="cursor: pointer;" v-for="group in groups"  :key="group.id">
          <td v-on:click="seeGroup(group.id)" >{{group.name}}</td>
        </tr>
      </table>
      </div>
    </div>
    <modal name="createGroupModal" :scrollable="true" :draggable="true" height="auto">
      <appNewGroup></appNewGroup>
    </modal>
    <modal name="seeGroupModal" :scrollable="true" :draggable="true" height="auto">
      <appGroup :singleGroupObject="singleGroupObj"></appGroup>
    </modal>

  </template>
  </div>
</template>

<script>
import Loader from './Loader.vue'
import Navbar from './Navbar.vue'
import NewGroup from './NewGroup.vue'
import Group from './Group.vue'
import session from '../Session.js'

export default {
  name: 'groups',
  data () {
    return {
      error: false,
      groups: null,
      singleGroupObj: {},
      loading: {
        users: false,
        groups: false,
        membership: false
      }
    }
  },
  created(){
      this.loading.groups = true;
      this.$http.get('https://gym-management-system-cc.herokuapp.com/api/v1/groups/index').then(response => {
      // success callback
      this.loading.groups = false;
      return response.json();
    }, error => {
      // error callbackif(error.status){
        if(error.status){
          console.log(`Došlo je do pogreške ${error.status}`);
          this.error = true;
        }
    }).then(data => {
      if(data.status=='401')session.sessionDestroy();
      //obrada podataka
      this.groups = data.groups;

    });


  },
  methods: {
    createGroup(){
      this.$modal.show('createGroupModal');
    },
    seeGroup(id){
      var self = this;
      this.groups.forEach(function(x) {
        if(x.id==id){
          self.singleGroupObj=x;
        }
      });
      this.$modal.show('seeGroupModal');
    }
  },
  components:{
    Loader,
    appNavbar: Navbar,
    appNewGroup: NewGroup,
    appGroup: Group
  }
}
</script>

<style>

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
    background-color: #43C69C;;
    color: white;
}
</style>
