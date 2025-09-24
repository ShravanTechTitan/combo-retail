import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        target: "https://combo-retail-backend.onrender.com",
        target:"api.universal.com", // Local backend URL for development
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
