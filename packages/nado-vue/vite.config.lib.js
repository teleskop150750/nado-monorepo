import path from 'node:path'
import { fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// eslint-disable-next-line import/no-unresolved
import DefineOptions from 'unplugin-vue-define-options/vite'
import { defineConfig } from 'vite'

const getPackageName = 'nado'

const fileName = {
  es: `${getPackageName}.mjs`,
  cjs: `${getPackageName}.cjs`,
  iife: `${getPackageName}.iife.js`,
}

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: false,
  plugins: [vue(), DefineOptions(), vueJsx()],
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src/index.js'),
      name: 'Nado',
      formats: ['es', 'cjs', 'iife'],
      fileName: (format) => fileName[format],
    },
    rollupOptions: {
      treeshake: true,
      external: ['vue', 'vue-router'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  optimizeDeps: {
    include: ['vue'],
  },
})
