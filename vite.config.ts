import vue from '@vitejs/plugin-vue';
import ImportmapPlugin from 'importmap-plugin';
import { fileURLToPath, URL } from 'node:url';
import { Vuetify3Resolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

const fileHashMap: { [s in string]?: true } = {};

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
        sanitizeFileName (filename) {
          // TODO vite-plugin-tidychunks
          // TODO modulePrefix = 'module', vendorPrefix = 'vendor', packageManager = 'pnpm'|'npm'|'yarn'
          // TODO rollup-plugin-, vite-plugin-
          // TODO https://vitejs.dev/guide/api-plugin.html#config
          if (filename === 'index' || filename.includes('.')) return filename;

          let code = filename.split('').reduce((prev, curr) => prev + curr.charCodeAt(0), 0);
          let hex = code.toString(16).padStart(3, '0');

          while (hex in fileHashMap) {
            code++;
            hex = code.toString(16).padStart(3, '0');
          }

          return `module.${hex}`;
        },
        plugins: [
          ImportmapPlugin({
            base: '/',
            external: false,
            hashLength: 8,
            indexHtml: 'index.html',
          }),
        ],
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
