import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'], // Ensure single React instance
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Local backend URL for development
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
