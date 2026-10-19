import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages project site: ตั้ง BASE_PATH=/ชื่อ-repo/ ตอน build
// User site (username.github.io): ปล่อย BASE_PATH ว่าง
const base = process.env.BASE_PATH ?? '/'

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    open: '/seat?g=ICE0284',
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
    open: '/seat?g=ICE0284',
  },
})
