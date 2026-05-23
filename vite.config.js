import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/vue_chat/',
  server: {
    port: 3000,
    host: true
  }
})
