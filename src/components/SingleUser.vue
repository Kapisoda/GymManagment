<template>
<div>
  <loader v-if="loading.user || loading.groups ||loading.membership"></loader>
  <template v-else>
  <div class="row">
    <form class="col s12">
      <div class="row" v-if="errorsArray">
        <div class="danger" v-for="errorMessage in errorsArray">
          <p><strong>Oprez!</strong> {{errorMessage}}</p>
        </div>
      </div>
          <div class="alert" v-if="statusSelect == 'inactive'">
            <span class="closebtn"></span>
            <strong>Pozor!</strong> Korisniku je istekla članarina ili je neaktivan.
          </div>
          <div class="warning" v-if="statusSelect == 'pause'">
            <span class="closebtn"></span>
            <strong></strong> Korisniku je članarina pauzirana, za nastavak članarine potvrdite dolazak.
          </div>
          <div class="alert" v-if="noticeMessage != ''">
            <span class="closebtn"></span>
            <strong>Pozor!</strong> {{noticeMessage}}
          </div>
      <div v-if="disabled">
        <div class="row">
          <div class="input-field col s12">
            <center>
                <h3>{{object.user.first_name}} {{object.user.last_name}}</h3>
            </center>
          </div>
        </div>
        <div class="row">

              <p style="text-align: center"><b style="color: gray;">Grupe: {{stringOfGroups}}</b></p>

        </div>
        <div class="row">
            <p style="text-align: center"><b style="color: gray;">Članarine: </b></p>
            <h4 style="text-align: center"><b>{{stringOfMemberships}}</b></h4>
        </div>
        <div class="row">
          <p style="text-align: center"><b style="color: gray;">Članarina vrijedi do: </b></p>
          <h4 style="text-align: center"><b>{{time}}</b></h4>
        </div>
      </div>
      <div v-else>
        <h3 class="title">Korisnik</h3>
      <div class="row">
        <div class="input-field col s6">
          <input :disabled="disabled" id="first_name" type="text" class="validate" v-model="object.user.first_name">
          <label class="active" for="first_name">Ime:</label>
        </div>
        <div class="input-field col s6">
          <input :disabled="disabled" id="last_name" type="text" class="validate" v-model="object.user.last_name">
          <label class="active" for="last_name">Prezime:</label>
        </div>
      </div>

      <div class="row">
        <div class="input-field col s6">
          <input :disabled="disabled" id="Address" type="text" class="validate" v-model="object.user.address">
          <label class="active" for="Address">Adresa</label>
        </div>
        <div class="input-field col s6">
          <input :disabled="disabled" id="OIB" type="text" class="validate" v-model="object.user.OIB">
          <label class="active" for="OIB">OIB:</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s6">
          <input :disabled="disabled" id="birthDate" type="date" v-model="object.user.birth_date">
          <label class="active" for="birthDate">Datum rođenja</label>
        </div>
        <div class="input-field col s6">
          <input :disabled="disabled" id="cardNumber" type="text" class="validate" v-model="object.user.code">
          <label class="active" for="cardNumber">Broj kartice</label>
        </div>
      </div>

      <div class="row">
        <div class="input-field col s6">
          <input :disabled="disabled" id="Email" type="text" class="validate" v-model="object.user.email">
          <label class="active" for="Email">Email</label>
        </div>
        <div class="input-field col s6">
          <label class="active" for="aktivnost">Aktivnost</label>
          <br />
          <v-select :disabled="disabled" v-model="statusSelect" :options="[{ label: 'Aktivni', value: 'active'},{ label: 'Neaktivni', value: 'inactive'}, { label: 'Pauza', value: 'pause'}]"></v-select>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s6">
          <input :disabled="disabled" id="phoneNumber" type="text" class="validate" v-model="object.user.phone_number">
          <label class="active" for="phoneNumber">Tel:</label>
        </div>
        <div class="input-field col s6">
          <label class="active" for="gender">Spol</label>
          <br />
          <v-select :disabled="disabled" v-model="genderSelect" :options="[{ label: 'M', value: 'm'},{ label: 'Ž', value: 'ž'}]"></v-select>
        </div>
      </div>

      <div class="row">
        <div class="input-field col s12">
           <label class="active" for="Memberships">Članarine</label>
           <br />
           <v-select multiple :disabled="disabled" type="text" v-model="membershipOption" :options="membershipsForPick"></v-select>
        </div>
      </div>
      <div class="row">
        <div class="field col s12">
          <label class="active" for="groups">Grupe</label>
          <br />
          <v-select multiple :disabled="disabled" v-model="groupOption" :options="groupsForPick"></v-select>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s6">
          <input :disabled="disabled" id="from" type="date" v-model="object.user.membership_starts_at">
          <label class="active" for="from">Trajanje članarine od:</label>
        </div>
        <div class="input-field col s6">
          <input :disabled="disabled" id="to"  type="date" v-model="object.user.membership_ends_at" >
          <label class="active" for="to">Trajanje članarine do:</label>
        </div>
      </div>
      </div>

    </form>
    <div class="row" v-if="disabled">
      <div class="input-field col s3">

      </div>
      <div class="input-field col s6">
            <label class="active" for="chosenMembership">Izaberite članarinu za potvrdu dolaska</label>
            <br />
            <v-select  v-model="chosenMembership" :options="membershipOption"></v-select>
      </div>
      <div class="input-field col s3">
      </div>
      </div>
    <div class="row" v-if="disabled">
      <div class="input-field col s6">
        <button v-on:click="disabled = !disabled; changeHandler()" class="buttonClass waves-effect waves-light btn">Promjeni informacije</button>
      </div>
      <div class="input-field col s6">
          <button v-on:click="confirmArrival"  class="buttonClass waves-effect waves-light btn">Potvrdi dolazak</button>
      </div>
    </div>
    <div v-else>
      <div class="row">
      <div class="input-field col s6">
          <button v-on:click="changeUser" class="buttonClass waves-effect waves-light btn">Potvrdi promjenu</button>
      </div>
      <div class="input-field col s6">
        <button class="buttonClass waves-effect waves-light btn" v-on:click="addOneMonth" >Produži članarinu</button>
      </div>
    </div>
      <div class="row">
        <div class="input-field col s6">

            <button class="buttonClass waves-effect red btn" v-on:click="deleteUser" >Izbriši korisnika</button>

        </div>
      </div>

    </div>
  </div>
  </template>
</div>
</template>

<script>
import Loader from './Loader.vue'
import session from '../Session.js'
import moment from 'moment'

export default {
  name: 'singleUser',
  props: ['singleUserObject'],
  data () {
    return {
      attendanceObject:{
        member_attendance: {
		          code: '',
		          membership_id: ''
	           }
      },
      object: {
        user: {
          id: '',
          first_name: '',
          last_name: '',
          birth_date: '',
          email: '',
          status: '',
          birth_date: '',
          OIB: '',
          address: '',
          phone_number: '',
          sex: '',
          code: '',
          membership_type_ids: [],
          group_ids: [],
          membership_starts_at: '',
          membership_ends_at: '',
          membership_pause_at: ''
        }
      },
      disabled: true,
      error: false,
      statusSelect: '',
      genderSelect: '',
      membershipsActive: [],
      membershipsForPick: [],
      membershipOption: '',
      groupsActive: [],
      groupsForPick: [],
      groupOption: '',
      statusSelect: '',
      genderSelect: '',
      errorUser: '',
      chosenMembership: '',
      errorsArray: [],
      noticeMessage: '',
      stringOfMemberships: '',
      stringOfGroups: '',
      loading: {
        user: false,
        membership: false,
        groups: false
      },
      flagToChangeUser: false,
      time: '',
      doc: '',
      numberOfEnter: 0
    }
  },
  methods:{
    deleteUser(){
      var por = confirm("Jeste li sigurni da želite izbrisati korisnika?");
      if(por){
      this.$http.post('https://gym-management-system-cc.herokuapp.com/api/v1/users/destroy', this.object).then(response => {
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
        alert(data.notice);
        location.reload();
      });
    }
    },
    changeHandler(){
      document.removeEventListener('keyup', this.foo);
    },
    foo(event){
        this.numberOfEnter++;
        console.log(this.numberOfEnter);
        console.log(event);
        if(event.keyCode == 13) {
          //this.confirmArrival();
        }
    },
    confirmArrival(){
      //chosenMembershipthis.errorsArray=[];
      if(!this.object.user.first_name) this.errorsArray.push("Potrebo je upisati ime korisnika.");
      if(!this.object.user.last_name) this.errorsArray.push("Potrebo je upisati prezime korisnika.");
      if(!this.object.user.code) this.errorsArray.push("Potrebo je zapisati korisnikovu karticu.");
      if(!this.statusSelect) this.errorsArray.push("Potrebo je odabrati aktivnost korisnika.");
      /*if(this.statusSelect == 'pause'){
        this.object.user.status = 'active';
        this.flagToChangeUser = true;
        this.changeUser();
      }*/
      if(!this.membershipOption || this.membershipOption.length == 0) this.errorsArray.push("Potrebo je odabrati članarinu korisnika.");
      if(!this.groupOption || this.groupOption.length == 0) this.errorsArray.push("Potrebo je odabrati grupu korisnika.");
      if(this.errorsArray.length == 0){
      this.noticeMessage = '';
      if(this.chosenMembership && this.object.user.code){
        this.attendanceObject.member_attendance.code = this.object.user.code;
        this.attendanceObject.member_attendance.membership_id = this.chosenMembership.value;
        this.$http.post('https://gym-management-system-cc.herokuapp.com/api/v1/member_attendances/create', this.attendanceObject).then(response => {
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
          if(data.notice)this.noticeMessage = data.notice.detail;
          if(this.noticeMessage == '')location.reload();
        });

      }else{
        this.noticeMessage = 'Prije potvrde dolaska potrebno je odabrati vrstu članarine.';
      }
    }
    },
    addOneMonth(){
      this.object.user.membership_starts_at = moment(this.object.user.membership_starts_at).add(1, 'M').format('YYYY-MM-DD');
      this.object.user.membership_ends_at = moment(this.object.user.membership_ends_at).add(1, 'M').format('YYYY-MM-DD');
    },
    changeUser(){

      this.errorsArray=[];
      if(!this.object.user.first_name) this.errorsArray.push("Potrebo je upisati ime korisnika.");
      if(!this.object.user.last_name) this.errorsArray.push("Potrebo je upisati prezime korisnika.");
      if(!this.object.user.code) this.errorsArray.push("Potrebo je zapisati korisnikovu karticu.");
      if(!this.statusSelect) this.errorsArray.push("Potrebo je odabrati aktivnost korisnika.");
      if(!this.membershipOption || this.membershipOption.length == 0) this.errorsArray.push("Potrebo je odabrati članarinu korisnika.");
      if(!this.groupOption || this.groupOption.length == 0) this.errorsArray.push("Potrebo je odabrati grupu korisnika.");
      if(this.errorsArray.length == 0){
      var self = this;

      //if(!this.flagToChangeUser){
        if(this.statusSelect){
          this.object.user.status= this.statusSelect.value;
          if(this.statusSelect.value=='pause'){
            this.object.user.membership_pause_at = moment().format('YYYY-MM-DD');
          }else {
            this.object.user.membership_pause_at ='';
          }
        }
      //}
      console.log('2');
      if(this.genderSelect){
        this.object.user.sex= this.genderSelect.value;
      }
      if(this.membershipOption){
        this.membershipOption.forEach(function(el){
          self.object.user.membership_type_ids.push(el.value);
        });
      }
      if(this.groupOption){
        this.groupOption.forEach(function(el){
          self.object.user.group_ids.push(el.value);
        });
      }

      this.$http.post('https://gym-management-system-cc.herokuapp.com/api/v1/users/update', this.object).then(response => {
      // success callback
        this.error = false;
        return response.json();
      }, error => {
        // error callback
        if(error.status){
          console.log(`error is ${error.status}`);
          this.error = true;
        }
      }).then(data => { if(data.status=='401')session.sessionDestroy();
      //if(!this.flagToChangeUser){
      location.reload();
      //}
      });
      //this.disabled=  true;

      }
    }
  },
  created(){

      this.loading.user = true;
      this.loading.membership = true;
      this.loading.groups = true;

      this.object.user.id = this.singleUserObject.id;
      this.object.user.first_name = this.singleUserObject.first_name;
      this.object.user.last_name = this.singleUserObject.last_name;
      this.object.user.birth_date = this.singleUserObject.birth_date;
      this.object.user.email = this.singleUserObject.email;
      this.statusSelect = this.singleUserObject.status;
      this.object.user.OIB = this.singleUserObject.OIB;
      this.object.user.address = this.singleUserObject.address;
      this.genderSelect = this.singleUserObject.sex;
      this.object.user.code = this.singleUserObject.code;
      this.object.user.membership_starts_at = this.singleUserObject.membership_starts_at;
      this.object.user.membership_ends_at = this.singleUserObject.membership_ends_at;
      this.object.user.phone_number = this.singleUserObject.phone_number;
      this.time = moment(this.object.user.membership_ends_at).locale("hr").format('L');
      var self = this;
      this.singleUserObject.membership_types.forEach(function(el){
        let obj = {
          label: el.name,
          value: el.id }
          if(self.stringOfMemberships){
            self.stringOfMemberships +=', '+ el.name
          }else{
          self.stringOfMemberships += el.name;
          }
          self.membershipsActive.push(obj);
          self.membershipOption = self.membershipsActive;
      });
      this.singleUserObject.groups.forEach(function(el){
        let obj = {
          label: el.name,
          value: el.id }
          if(self.stringOfGroups){
            self.stringOfGroups +=', '+ el.name
          }else{
          self.stringOfGroups += el.name;
          }
          self.groupsActive.push(obj);
          self.groupOption = self.groupsActive;
      });

      if(this.membershipsActive.length==1){
        this.chosenMembership=this.membershipsActive[0];
      }
      this.loading.user = false;

      this.$http.get('https://gym-management-system-cc.herokuapp.com/api/v1/membership_types/index').then(response => {
        // success callback
        this.loading.membership = false;
        return response.json();
      }, error => {
        // error callback
        if(error.status){
          console.log(`error is ${error.status}`);
          if(error.status=='401')session.sessionDestroy();
          this.error = true;
        }
      }).then(data => {
        //obrada podataka
        this.memberships= data.membership_types;
        var self = this;
        data.membership_types.map(x => {
          let obj = {
            label: x.name,
            value: x.id
          }
          self.membershipsForPick.push(obj);
        });
      });
      this.$http.get('https://gym-management-system-cc.herokuapp.com/api/v1/groups/index').then(response => {
        // success callback
        this.loading.groups = false;
        return response.json();
      }, error => {
        // error callback
      }).then(data => {
        //obrada podataka
        this.groups = data.groups;
        var self = this;
        data.groups.map(x => {
          let obj = {
            label: x.name,
            value: x.id
          }
            self.groupsForPick.push(obj);
        });
      });

  },
  beforeDestroy(){
    window.removeEventListener('keyup', this.foo);
  },
  mounted(){
    window.addEventListener('keyup',  this.foo);
  },
  components:{
    Loader
  }

}

</script>


<style scoped>

input[type="Date"]:disabled {
    color: black;
}
input[type="text"]:disabled {
    color: black;
}
.danger {
    background-color: #ffdddd;
    border-left: 6px solid #f44336;
}
.warning {
    padding: 20px;
    background-color: #ff9800; /* yellow */
    color: white;
    margin-bottom: 15px;
    border-radius: 5px;
}
.alert {
    padding: 20px;
    background-color: #f44336; /* Red */
    color: white;
    margin-bottom: 15px;
    border-radius: 5px;
}

.buttonClass{
  margin: 0px 0px 10px 20px;
}

h3.title{
  text-align: center;
}
div.textUser{
  font-size: 20px;
  margin: 20px 20px 20px 20px;
}
</style>
