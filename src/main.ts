import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import Vuetify from 'vuetify';
import pl from 'vuetify/src/locale/pl';
import router from '@/router';
import store from '@/store';
import App from '@/app.vue';

Vue.config.productionTip = false;

Vue.use(VueClipboard);
Vue.use(Vuetify);

// @ts-ignore
const vuetify = new Vuetify({
  iconfont: 'mdi',
  lang: {
    locales: {
      pl,
    },
    current: 'pl',
  },
});

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  components: {
    App,
  },
  router,
  store,
  vuetify,
  render: h => h(App),
});
