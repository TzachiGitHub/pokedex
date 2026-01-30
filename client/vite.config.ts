import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Proxy both /api and /icon to Flask backend
      '^/(api|icon)': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
