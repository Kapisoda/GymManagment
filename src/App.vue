<template>
  <div id="app">

    <router-view/>
  </div>
</template>

<script>
import {fixedActionButton} from "vue-materialize"
export default {
  name: 'App',
  data(){
    return{

    }
  },
  components: {
    "fab": fixedActionButton
  }

}
</script>

<style>

</style>
