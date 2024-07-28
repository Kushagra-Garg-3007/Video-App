import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/user': 'http://localhost:8080',
      '/video': 'http://localhost:8080',
      '/subscription': "http://localhost:8080",
      '/comment': "http://localhost:8080",
    }
  },
  plugins: [react()],
})
