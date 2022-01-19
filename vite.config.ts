import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import { resolve } from 'path';
import Components from 'unplugin-vue-components/vite';
import { VuetifyResolver } from 'unplugin-vue-components/resolvers';
import checker from 'vite-plugin-checker';
import ScriptSetup from 'unplugin-vue2-script-setup/vite';

// https://vitejs.dev/config/
// https://github.com/logue/vite-vue2-vuetify-ts-starter/blob/master/vite.config.ts
export default defineConfig({
  plugins: [
    createVuePlugin(),
    ScriptSetup(),
    // Vuetify
    Components({
      // generate `components.d.ts` global declarations
      // dts: true,
      // auto import for directives
      directives: false,
      // resolvers for custom components
      resolvers: [VuetifyResolver()],
    }),
    checker({
      typescript: true,
      eslint: {
        files: ['./src'],
        extensions: ['.ts', '.js', '.vue'],
      },
      overlay: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
