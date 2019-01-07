import 'vuetify/dist/vuetify.min.css';

import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';
import pl from 'vuetify/src/locale/pl';
import router from '@/router';
import store from '@/store';
import App from '@/app.vue';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false;

Vue.use(VueClipboard);
Vue.use(Vuetify, {
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
  components: {
    App,
  },
  router,
  store,
  el: '#app',
  render: h => h(App),
});
