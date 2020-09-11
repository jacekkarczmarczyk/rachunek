// https://github.com/vuetifyjs/vuetify-loader/issues/44#issuecomment-630272621
declare module 'vuetify/lib/framework' {
  import { Vuetify } from 'vuetify';

  const vuetify: Vuetify;

  export default vuetify;
}
