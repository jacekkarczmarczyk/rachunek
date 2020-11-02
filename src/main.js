import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import Vuetify from 'vuetify/lib/framework';
import pl from 'vuetify/src/locale/pl';
import router from '@/router';
import store from '@/store';
import App from '@/App.vue';

Vue.config.productionTip = false;
Vue.use(VueClipboard);
Vue.use(Vuetify);
const vuetify = new Vuetify({
  iconfont: 'mdi',
  lang: {
    locales: {
      pl,
    },
    current: 'pl',
  },
});

new Vue({
  name: 'Root',
  components: {
    App,
  },
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
// # sourceMappingURL=main.js.map
