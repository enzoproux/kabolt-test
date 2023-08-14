import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    "process.env.REQUEST_LIMIT": 5,
    "process.env.GOOGLE_MAP": {
      key: 'AIzaSyBj7y8wMdUSTch-jrk63CUf5BegUpRotHs'
    },
    "process.env.API_SETTINGS":{
      url: 'http://localhost:3000',
      routes: {
        societies : 'entreprises',
        society : 'entreprise',
        societyPagePdf: 'entreprise/pdf'
      }
    }
  }
})
