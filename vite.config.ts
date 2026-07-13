import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Proxy API calls to the booking server (npm run dev:api) during development.
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
})
