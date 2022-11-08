import App from '@/App.vue';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import { pl } from 'vuetify/locale';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import { router } from '@/router/router';

const Vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  locale: {
    locale: 'pl',
    messages: { pl },
  },
});
const app = createApp(App);

app.use(Vuetify);
app.use(router);
app.mount('#app');
