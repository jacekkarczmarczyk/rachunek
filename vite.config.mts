import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { Vuetify3Resolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
// https://github.com/logue/vite-vue2-vuetify-ts-starter/blob/master/vite.config.ts
export default defineConfig({
  define: {
    'import.meta.env.VITE_BUILD_TIME': `"${Date.now()}"`,
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        format: 'es',
        assetFileNames: 'assets/[hash].[ext]',
        entryFileNames: 'chunks/app.js',
        chunkFileNames: 'chunks/[name].js',
        manualChunks (id) {
          if (id.includes('src/env.ts')) return 'env';

          const match = id.match(/[\\/]node_modules[\\/]\.pnpm[\\/]([^+\\/]+).*\.m?js/);

          if (match) {
            return `vendor.${match[1].replace(/(.)@.*$/, '$1').replace('@', '')}`;
          }
        },
      },
    },
  },
  plugins: [
    vue(),
    // Vuetify
    Components({
      dirs: [],
      // generate `components.d.ts` global declarations
      // dts: true,
      // auto import for directives
      directives: false,
      // resolvers for custom components
      resolvers: [Vuetify3Resolver()],
    }),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx,js,vue}"',
      },
      overlay: true,
      vueTsc: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
