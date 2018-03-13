<template >
  <nav>
    <div class="nav-change nav-wrapper">
      <ul class="left hide-on-med-and-down">
        <li><router-link to="home">Početna</router-link></li>
        <li><router-link to="users">Korisnici</router-link></li>
        <li><router-link to="groups">Grupe</router-link></li>
        <li><router-link to="memberships">Članarine</router-link></li>
        <!--<li><a href="../../static/Upute za korištenja programa za teretane.pdf" download>Uputa za korštenje</a></li> -->
        <li><a href="#" onclick="window.open('../../static/Upute za korištenja programa za teretane .pdf', target='_blank', 'fullscreen=yes'); return false;">Uputa za korštenje</a></li>
      </ul>
      <ul class="right hide-on-med-and-down">
          <li><a v-on:click="singOut">Odjavi se </a></li>
      </ul>
    </div>
  </nav>
</template>

<script>
import session from '../Session.js'

export default {
name: 'navbar',
methods: {
    singOut(){
      let areYouSure = confirm("Jeste li sigurni da se zelite odjaviti?");
      if(areYouSure){

        session.sessionDestroy();
        this.$router.push({ path: '/login'});

      }

    }
  }
}//#43C69C
</script>

<style lang="css" scope>
.nav-change{
  background-color: #006666
}


</style>
