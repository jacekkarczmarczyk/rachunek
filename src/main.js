import 'vuetify/dist/vuetify.min.css'

import Vue from 'vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import App from './app.vue'

Vue.config.productionTip = false
Vue.use(Vuetify)

const init = () => new Vue({
  components: {
    App,
  },
  router,
  store,
  el: '#app',
  render: h => h(App),
})

init()
