import path from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({
      staticImport: true,
      insertTypesEntry: true,
      include: ["src/**/*.ts", "src/**/*.vue", "src/**/*.d.ts"],
    }),
  ],
  publicDir: false,
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "ui",
      formats: ["es", "cjs"],
      fileName: (format) => `ui.${format}.js`,
    },
    rollupOptions: {
      // убедитесь, что исключили библиотеки, которые не надо собирать
      // в вашу библиотеку (library)
      external: ["vue"],
      output: {
        // Предоставляем глобальные переменные, чтобы использовать их в UMD сборке
        // для экстернализированных зависимостей
        globals: {
          vue: "Vue",
        },
      },
    },
    sourcemap: true,
    // Reduce bloat from legacy polyfills.
    target: "esnext",
    // Leave minification up to applications.
    minify: false,
  },
});
