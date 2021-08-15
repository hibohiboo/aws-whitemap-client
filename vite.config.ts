import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
export const basePath = 'whitemap'
// https://vitejs.dev/config/
export default defineConfig({
  root: 'client',
  plugins: [vue()],
  resolve: {
    // viteのホットリロードのために、/で始める必要がある。
    alias: [{ find: '@', replacement: '/src' }],
  },
  base: `/${basePath}/`,
  build: {
    outDir: '../dist',
  },
});
