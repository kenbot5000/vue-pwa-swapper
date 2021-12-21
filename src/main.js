import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import Vuetify from 'vuetify/lib'
import vuetify from './plugins/vuetify';

import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')

Vue.use(Vuetify)
Vue.use(VueAxios, axios);