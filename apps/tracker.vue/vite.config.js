import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import DefineOptions from 'unplugin-vue-define-options/vite'
// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), DefineOptions(), vueJsx()],
  optimizeDeps: {
    include: ['vue'],
  },
  server: {
    port: 3030,
  },
})
