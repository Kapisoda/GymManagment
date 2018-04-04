<template>
  <div class="users">
    <appNavbar></appNavbar>
    <loader v-if="loading.users || loading.groups ||loading.membership"></loader>
    <template v-else>
      <div class="row">
        <div class="col s3">
          <!-- Grey navigation panel -->

          <!-- <p><button class="waves-effect waves-light btn" v-on:click="showUsers='active'">Active users</button></p>
        <p><button class="waves-effect waves-light btn" v-on:click="showUsers='inactive'">Inactive users</button></p>-->
          <p>Po aktivnostima:</p>
          <v-select v-model="filterArray" :options="[{ label: 'Aktivni', value: 'active'},{ label: 'Neaktivni', value: 'inactive'},{ label: 'Pauza', value: 'pause'}]"></v-select>
          <p>Po grupama:</p>
          <v-select v-model="groupOption" :options="groups"></v-select>
          <p>Po članarinama:</p>
          <v-select v-model="membershipOption" :options="membershipsForPick"></v-select>

          <p>M/Ž:</p>
          <v-select v-model="filterArrayGender" :options="[{ label: 'M', value: 'm'},{ label: 'Ž', value: 'ž'}]"></v-select>
          <br>
          <center>
            <button type="button" class="btn waves-effect waves-light teal" name="action" v-on:click="sendMail">Pošalji mail
              <i class="fa fa-envelope-o"></i>
            </button>
          </center>

        </div>
        <div class="col s9">
          <p>Pretraga:</p>
          <p>
            <input type="text" v-model="search" />
          </p>
          <div v-for="(user, index) in filterUsersSerch" :key="user.id" ></div>
          <table id="customers">
            <tr>
              <th>
                <input type="checkbox" id="myTextEditBoxIsFull" value="myTextEditBoxIsFull" v-on:click="chooseAll">
                <label for="myTextEditBoxIsFull"></label>
              </th>
              <th style="cursor: pointer;" v-on:click="stringForSort='first_name'; activeClassFunction();">Ime
                <a class="headerIcons" v-if="stringForSort=='first_name'">
                  <i :class="activeClass"></i>
                </a>
              </th>
              <th style="cursor: pointer;" v-on:click="stringForSort='last_name'; activeClassFunction();">Prezime
                <a class="headerIcons" v-if="stringForSort=='last_name'">
                  <i :class="activeClass"></i>
                </a>
              </th>
              <th>Datum isteka članarine</th>
              <th>Broj kartice</th>
              <th>Status</th>
              <th>M/Ž</th>
              <th>Članarine</th>
              <th>Grupe</th>
            </tr>
            <tr class="list-group-item" style="cursor: pointer;" v-for="(user, index) in filterUsersSerch" :key="user.id"> <!-- filterUsersSerch -->
              <td>
                <input type="checkbox" v-bind:id="user.id" v-bind:value="user.id" v-model="myTextEditBox">
                <label v-bind:for="user.id"></label>
              </td>
              <td v-on:click="singleUser(user.id)">{{user.first_name }}</td>
              <td v-on:click="singleUser(user.id)">{{user.last_name}}</td>
              <td v-on:click="singleUser(user.id)">{{exdate[user.id]}}</td><!--exdate[user.id]-->
              <td v-on:click="singleUser(user.id)">{{cardNumber[user.id]}}</td>
              <td v-on:click="singleUser(user.id)">{{user.status}}</td>
              <td v-on:click="singleUser(user.id)">{{user.sex}}</td>
              <td v-on:click="singleUser(user.id)">
                <p v-for="mem in user.membership_types">{{mem.name}}</p>
              </td>
              <td v-on:click="singleUser(user.id)">
                <p v-for="gro in user.groups">{{gro.name}}</p>
              </td>
            </tr>
           
          </table>
          <pagination class="pagColor"  :records="resultCount" :per-page="perPage" @paginate="setPage"></pagination>
        </div>
      </div>
      <a class="button-floater right btn-floating btn-large waves-effect waves-light red" v-on:click="startNewUser">
        <i class="material-icons">add</i>
      </a>
      <!--<button v-on:click="show">modal</button> -->
      <modal name="email" height="600px">
        <appEmail :usersForSendingMail="myTextEditBox"></appEmail>
      </modal>
      <modal name="newUser" :scrollable="true" :draggable="true" height="auto">
        <appNewUser></appNewUser>
      </modal>
      <modal name="singleUser" :scrollable="true" :draggable="true" height="auto">
        <appSingleUser :singleUserObject="singleUserObj"></appSingleUser>
      </modal>
    </template>
  </div>
</template>

<script>
  import Loader from './Loader.vue'
  import Navbar from './Navbar.vue'
  import Email from './Email.vue'
  import NewUser from './NewUser.vue'
  import filter from '../Filter.js'
  import SingleUser from './SingleUser.vue'
  import session from '../Session.js'
  import moment from 'moment'
  export default {

    name: 'users',
    data() {
      return {
        error: false,
        activeClass: '',
        ascDesc: '',
        stringForSortCheck: '',
        stringForSort: 'first_name',
        users: [],
        searchCards: '',
        search: '',
        myTextEditBox: [],
        myTextEditBoxIsFull: false,
        groups: [],
        groupOption: null,
        filterArray: null,
        filterArrayGroups: null,
        filterArrayGender: '',
        //članarine
        memberships: [],
        membershipsForPick: [],
        membershipOption: null,
        //objekt
        singleUserObj: {},
        loading: {
          users: false,
          groups: false,
          membership: false
        },
        exdate: {},
        cardNumber: {},
        page: 1,
        perPage: 10,
        resultCount: 0
        
      }
    },
    watch: {
      searchCards: function (val, oldVal) {
        var self = this;
        let i = 0;
        this.users.forEach(function (x) {
          if (x.name == val) {
            self.singleUserObj = x;
          }
          i++;
        });
        this.$modal.show('singleUser');

      }
    },
    created() {
      this.loading.users = true
      this.loading.groups = true
      this.loading.membership = true
     // this.filterArray = { label: 'Aktivni', value: 'active'};
      //dohvacanje svih usera
      this.$http.get(this.$callHttp +'/api/v1/users/index').then(response => {
        this.loading.users = false
        return response.json(); // success callback
      }, error => { /*rror callback*/
        if (error.status) {
          console.log(`error is ${error.status}`);
          this.error = true;
        }
      }).then(data => { /*obrada podataka*/
        if (data.status == '401') session.sessionDestroy();
        this.users = data.users;
         var self = this;
        this.users.forEach(function (el) {
          self.exdate[el.id] = moment(el.membership_ends_at).locale("hr").format('L');
          if(el.code){
          let res = el.code.split('?')[0];
          self.cardNumber[el.id] = res.replace('%','');
          }
         });
      }); 

      //dohvacanje svih grupa
      this.$http.get(this.$callHttp + '/api/v1/groups/index').then(response => {
        this.loading.groups = false
        return response.json(); // success callback
      }, error => { /* error callback*/
        if (error.status) {
          console.log(`error is ${error.status}`);
          this.error = true;
        }
      }).then(data => { /*obrada podataka*/
        if (data.status == '401') session.sessionDestroy();
        var self = this;
        data.groups.map(x => {
          let obj = {
            label: x.name,
            value: x.id
          }
          self.groups.push(obj);
        });
      });

      //dohvaćanje svih članarina
      this.$http.get(this.$callHttp +'/api/v1/membership_types/index').then(response => {
        // success callback
        this.loading.membership = false
        return response.json();
      }, error => { /* error callback */
        if (error.status) {
          console.log(`error is ${error.status}`);
          this.error = true;
        }

       }).then(data => {
        /*obrada podataka*/
        if (data.status == '401') session.sessionDestroy();
        this.memberships = data.membership_types;
        data.membership_types.map(x => {
          let obj = {
            label: x.name,
            value: x.id
          }
          this.membershipsForPick.push(obj);
        });
      });
    },
    methods: {
      setPage: function(page) {
      this.page = page;
      
    },
      sendMail() {
        if (this.myTextEditBox.length < 1) {
          alert('Potrebno je odabrati barem jednog člana za slanje maila');
        } else {
          this.$modal.show('email');
        }
      },
      activeClassFunction() {
        if (this.stringForSortCheck != this.stringForSort) {
          this.ascDesc = 'desc';
        }
        if (this.ascDesc == 'desc') {
          this.activeClass = 'hover_icon fa fa-sort-down';
          this.ascDesc = 'asc';
        } else {
          this.activeClass = 'hover_icon fa fa-sort-up';
          this.ascDesc = 'desc';
        }
        this.stringForSortCheck = this.stringForSort;

      },
      chooseAll() {
        let temp = [];
        if (!this.myTextEditBoxIsFull) {
          this.myTextEditBox = filter.foo(this.users, this.filterArray, this.stringForSort, this.search, this.ascDesc,
            this.membershipOption, this.groupOption, this.filterArrayGender);
          this.myTextEditBox.forEach(function (el) {
            temp.push(el.id);
            return el.id;
          });
          this.myTextEditBox = temp;
        } else {
          this.myTextEditBox = [];
        }
        this.myTextEditBoxIsFull = !this.myTextEditBoxIsFull
      },
      startNewUser() {
        this.$modal.show('newUser');
      },
      singleUser(id) {
        var self = this;
        let i = 0;
        this.users.forEach(function (x) {
          if (x.id == id) {
            self.singleUserObj = x;
          }
          i++;
        });

        this.$modal.show('singleUser');
      }
    },
    computed: {
      filterUsersSerch() {
        this.resultCount = filter.foo(this.users, this.filterArray, this.stringForSort, this.search, this.ascDesc, this.membershipOption,
          this.groupOption, this.filterArrayGender).length;
            
        var index = (this.page -1) * this.perPage;
        return filter.foo(this.users, this.filterArray, this.stringForSort, this.search, this.ascDesc, this.membershipOption,
          this.groupOption, this.filterArrayGender).slice(index, index + this.perPage);
          
      },
      
    },
    components: {
      Loader,
      appEmail: Email,
      appNewUser: NewUser,
      appNavbar: Navbar,
      appSingleUser: SingleUser
    }
  }
</script>

<style>

  .pagColor nav{
    background-color: #43C69C !important;
    color: #43C69C !important;
  }
  .pagination li.active{
    background-color: #43C69C !important;
  }
  .button-floater {
    position: fixed;
    bottom: 2em;
    right: 2em;
  }

  .headerIcons {
    color: white
  }

  #customers {
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  #customers td,
  #customers th {
    border: 1px solid #ddd;
    padding: 8px;
  }

  #customers tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  #customers tr:hover {
    background-color: #ddd;
  }

  #customers th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #43C69C;
    color: white;
  }

</style>
