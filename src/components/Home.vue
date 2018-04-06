<template lang="html">
  <div>
    <appNavbar></appNavbar>
    <loader v-if="loading.groups || loading.member_attendances || loading.users || loading.notes"></loader>
    <template v-else>
      <div class="row" v-if="noUserError">
        <div class="col s12">
          <div class="danger">
            <p>
              <strong>Oprez!</strong> Korisnik ne postoji</p>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col s12">
          <h5>Kartice</h5>
          <p>
            <input type="text" v-model="stringCard" autofocus/>
          </p>
          <!--onblur="this.focus()"  v-on:blur="myFunctionHere()-->
        </div>
      </div>
      <div class="row">
        <div class="col s4">
          <h5>Poruke</h5>
          <a class="button-floater btn-floating btn-large red" v-on:click="createNote">
            <i class="large material-icons">mode_edit</i>
          </a>
          <div class="info" v-for="note in notes">
            <p>
              <strong>{{note.author}}: </strong> {{note.body}}
              <i class="fa fa-close right" style="color:red; cursor: pointer" v-on:click="deleteMessage(note.id)"></i>
            </p>
          </div>
        </div>
        <div class="col s4">
          <h5>Statistika</h5>
          <pie-chart :data="chartData" :donut="true"></pie-chart>
          <pie-chart :data="chartDataUser" :donut="true"></pie-chart>
        </div>
        <div class="col s4">
          <h5>Dolasci</h5>
          <div class="input-field col s6">
            <label class="active" from="someDate">Datum za dolaske:</label>
            <input id="someDate" type="date" v-model="someDate">
          </div>
          <p>Broj ukupnih dolazaka na odabrani dan:
            <strong> {{attendanceNumber}}</strong>
          </p>
          <table id="customers">
            <tr>
              <th>Ime i prezime</th>
              <th>Datum i vrijeme dolaska</th>
              <th>Kartica</th>
            </tr>
            <tr class="list-group-item" v-for="user in usersAttendance" :key="user.id">
              <td>{{user.first_name}} {{user.last_name}}</td>
              <td>{{user.time}}</td>
              <td>{{user.code}}</td>
            </tr>
          </table>
        </div>
      </div>
      <modal name="createNoteModal" :scrollable="true" :draggable="true" height="auto">
        <appNewNote @interface="focusBlure"></appNewNote>
      </modal>
      <modal name="singleUser" :scrollable="true" :draggable="true" height="auto">
        <appSingleUser :singleUserObject="singleUserObj"></appSingleUser>
      </modal>
    </template>
  </div>
</template>


<script>
import Loader from './Loader.vue'
import NavBar from './Navbar.vue'
import NewNote from './NewNote.vue'
import SingleUser from './SingleUser.vue'
import session from '../Session.js'
import moment from 'moment'

export default {
  name: 'home',
  data(){
    return{
      error: false,
      stringCard: '',
      usersAttendance: [],
      users: [],
      chartData: [],
      chartDataUser: [],
      notes: [],
      object:{
        note:{
          id: ''
        }
      },
      singleUserObj: null,
      noUserError: false,
      numberUnderline: 0,
      focus: true,
      loading:{
        notes: false,
        groups: false,
        member_attendances: false,
        users: false
      },
      someDate: '',
      attendanceNumber: 0
    }
  },
  created(){
    this.loading.notes = true;
    this.loading.groups = true;
    this.loading.member_attendances = true;
    this.loading.users = true;
  //  this.$http.get(this.$callHttp +'/api/v1/member_attendances/index?count=20').then(response => {
  //     this.loading.member_attendances = false;
  //     return response.json();// success callback
  //   }, error => {
  //     if(error.status){
  //    console.log(`Došlo je do pogreške ${error.status}`);
  //     this.error = true;
  //     } /*rror callback*/  }).then(data => {/*obrada podataka usersAttendance*/
//
  //      if(data.status=='401')session.sessionDestroy();
  //     var self = this;
  //     data.member_attendances.reverse();
       
  //    for(let i=0; i<data.member_attendances.length; i++){
  //      if(data.member_attendances[i].user.first_name){
  //       if(data.member_attendances[i].user.code){
  //        var res = data.member_attendances[i].user.code.split('?')[0];
  //        res = res.replace('%','');
  //       }
  //       let obj={
  //       first_name: data.member_attendances[i].user.first_name,
  //         last_name: data.member_attendances[i].user.last_name,
  //         time: moment(data.member_attendances[i].created_at).format('DD.MM.YYYY, HH:mm'),
  //         code: res
  //       }
  //      self.usersAttendance.push(obj);
  //     };
  //   }
  // });
this.loading.member_attendances = false;

    this.$http.get(this.$callHttp +'/api/v1/groups/index').then(response => {
    /*success callback*/ return response.json();}, error => {/* error callback*/}).then(data => {
        //obrada podataka*/
        this.loading.groups = false;
        this.groups = data.groups;
        var self = this;
        data.groups.forEach(function(el){
          self.chartData.push([el.name, el.users.length ]);
        });
    });
    this.$http.get(this.$callHttp +'/api/v1/notes/index').then(response => {
      this.loading.notes = false;
      return response.json();// success callback
    }, error => {
        if(error.status){
        console.log(`Došlo je do pogreške ${error.status}`);
        this.error = true;
      } /*rror callback*/
    }).then(data => {/*obrada podataka*/
      if(data.status=='401')session.sessionDestroy();
      this.notes = data.notes.reverse();});

    this.$http.get(this.$callHttp +'/api/v1/users/index').then(response => {
      this.loading.users = false;
      return response.json();// success callback
    }, error => {  /*rror callback*/
      if(error.status){
      console.log(`Došlo je do pogreške ${error.status}`);
      this.error = true;
    }
  }).then(data => {/*obrada podataka*/
      if(data.status=='401')session.sessionDestroy();
      
      
      var self = this;
      data.users.forEach(function(el){
        if(typeof el !== 'undefined'){
        if(typeof el.code !== 'undefined' && el.code !== null && el.code !== ""){
          self.users.push(el);
        }};
      })
      console.log(this.users)
      
    });

    this.$http.get(this.$callHttp +'/api/v1/dashboards/index').then(response => {
    /*success callback*/ return response.json();}, error => {/* error callback*/}).then(data => {
        //obrada podataka*/
       this.chartDataUser.push(['Aktivni', data.status.active_count]);
       this.chartDataUser.push(['Neaktivni', data.status.inactive_count]);
       this.chartDataUser.push(['Pauzirani', data.status.pause_count]);
    });
    this.someDate = moment().format('YYYY-MM-DD');
    
   
     


  },
  methods:{
    
    focusBlure(){

    },
    createNote(){
      this.focus = false;
      this.$modal.show('createNoteModal');
    },
    deleteMessage(id){
      var por = confirm("Jeste li sigurni da želite izbrisati poruku?");
      if(por){
      this.object.note.id = id;
      this.$http.post(this.$callHttp +'/api/v1/notes/destroy', this.object).then(response => {
      // success callback
        this.error = false;
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
        location.reload();
      });


      }
    }
  },
  components:{
    appNavbar: NavBar,
    appNewNote: NewNote,
    appSingleUser: SingleUser,
    Loader

  },
  watch:{
    stringCard(){ //_.includes(this.stringCard, '_')
      var tempError = [];
      var self = this;
      var nesto = _.includes(this.stringCard, '?');
      if(nesto){
      this.stringCard = this.stringCard.toLowerCase();
      this.numberUnderline = this.stringCard.split("?").length - 1;
      if(this.numberUnderline==2){
        this.users.forEach(function(x) {
          if(x.code===self.stringCard){
            //console.log(x);
            self.singleUserObj=x;
            self.stringCard = '';
            tempError[0] = -1;
            self.numberUnderline = 0;
          }else{
            tempError.push(1);
          }
        });
        if(tempError[0]==-1){
          this.noUserError = false;
          this.$modal.show('singleUser');
        }else if (tempError[0]==1) {
          this.noUserError = true;
          this.numberUnderline = 0;
          this.stringCard='';
        };
      };

      setTimeout(function(){
        self.numberUnderline = 0;
        self.stringCard='';
        self.noUserError = false;
      }, 5000);
      }
    },
    someDate(){
      this.$http.get(this.$callHttp +`/api/v1//member_attendances/show?date=${this.someDate}`).then(response => {
    /*success callback*/ return response.json();}, error => { console.log(`error is ${error.status}`); }).then(data => {
        //obrada podataka*/
        this.attendanceNumber = data.member_attendances.length;
        this.usersAttendance = [];
        var self = this;
       data.member_attendances.reverse();
       
      for(let i=0; i<data.member_attendances.length; i++){
        if(data.member_attendances[i].user.first_name){
         if(data.member_attendances[i].user.code){
          var res = data.member_attendances[i].user.code.split('?')[0];
          res = res.replace('%','');
         }
         let obj={
         first_name: data.member_attendances[i].user.first_name,
           last_name: data.member_attendances[i].user.last_name,
           time: moment(data.member_attendances[i].created_at).format('DD.MM.YYYY, HH:mm'),
           code: res
         }
        self.usersAttendance.push(obj);
       };
      }
    });
    }
  }
}
</script>

<style lang="css" scoped>
.danger {
    background-color: #ffdddd;
    border-left: 6px solid #f44336;
    margin-bottom: 15px;
    padding: 4px 12px;
}
h5{
  color: white;
  background-color: #43C69C;
  text-align: center;
}

.success {
    background-color: #ddffdd;
    border-left: 6px solid #4CAF50;
    margin-bottom: 15px;
    padding: 4px 12px;
}

.button-floater{
  position: fixed;
    bottom: 2em;
    left: 2em;
}
.btn-small {
    height: 15px;
    line-height: 15px;
    padding: 0 0.2rem;
}
.info {
    background-color: #e7f3fe;
    border-left: 6px solid #2196F3;
    margin-bottom: 15px;
    padding: 4px 12px;
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
