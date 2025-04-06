import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '',
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: process.env.NODE_ENV === "development" ? {
    proxy: {
      '/api': {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        headers: {
          Accept: "application/json",
        }
      }
    }
  } : undefined
})
