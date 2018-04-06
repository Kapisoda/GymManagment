// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VModal from 'vue-js-modal'
import lodash from 'lodash'
import vSelect from 'vue-select'
import Chartkick from 'chartkick'
import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'
import jQuery from 'jquery'
import 'materialize-css'
import {Pagination} from 'vue-pagination-2';
Vue.component('pagination', Pagination);
//const bugsnag = require('bugsnag-js')
//const bugsnagClient = bugsnag('b31ae9cc55512f16cd20807f489e9275')

// Initialize Vue before we start the BugsnagVue plugin

//const bugsnagVue = require('bugsnag-vue')

//bugsnagClient.use(bugsnagVue(Vue))
//https://gms-test.herokuapp.com
//https://gym-management-system-cc.herokuapp.com
Vue.prototype.$callHttp = 'https://gms-test.herokuapp.com'

Vue.use(VueChartkick, { Chartkick })


Vue.component('v-select', vSelect)
Vue.prototype._ = lodash
Vue.use(VModal)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
