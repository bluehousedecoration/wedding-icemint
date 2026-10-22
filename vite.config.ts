import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages: ตั้ง BASE_PATH=/ชื่อ-repo/ ตอน build — dev บังคับ `/` เสมอ (โดเมนจริง)
export default defineConfig(({ command }) => {
  const base =
    command === 'serve' ? '/' : (process.env.BASE_PATH?.replace(/\/?$/, '/') ?? '/')

  return {
  base,
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    /** false = ถ้า 5173 ถูกใช้ จะลองพอร์ตถัดไป แทน error เปิดไม่ได้ */
    strictPort: false,
    open: '/',
    watch: {
      ignored: [
        '**/AW flies/**',
        '**/*.crdownload',
        '**/.crdownload',
        '**/*.mp4',
        '**/*.pdf',
      ],
    },
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: false,
    open: '/',
  },
}
})
