import App from '@/App.vue';
import router from '@/router';
import '@mdi/font/css/materialdesignicons.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import type { CreateElement } from 'vue';
import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import Vuetify from 'vuetify/lib/framework';
import pl from 'vuetify/src/locale/pl';

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
  name: 'RootComponent',
  components: {
    App,
  },
  provide () {
    return {
      vuetify: this.$vuetify,
    };
  },
  router,
  vuetify,
  render: (h: CreateElement) => h(App),
}).$mount('#app');
