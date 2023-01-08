import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// eslint-disable-next-line import/no-unresolved
import DefineOptions from 'unplugin-vue-define-options/vite'
import { defineConfig } from 'vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), DefineOptions(), vueJsx()],
  optimizeDeps: {
    include: ['vue'],
  },
  server: {
    host: true,
    port: 3333,
  },
})
