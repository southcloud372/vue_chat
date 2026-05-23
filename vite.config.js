import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  base: mode === 'ghpages' ? '/vue_chat/' : '/',
  server: {
    port: 3000,
    host: true
  }
}))
