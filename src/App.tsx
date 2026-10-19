import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { guestQueryParam } from './lib/guestCode'
import { HomePage } from './pages/HomePage'
import { PhotosPage } from './pages/PhotosPage'
import { PhotographerUploadPage } from './pages/PhotographerUploadPage'
import { SchedulePage } from './pages/SchedulePage'
import { SeatPage } from './pages/SeatPage'
import { SharePage } from './pages/SharePage'
import { VideoPage } from './pages/VideoPage'
import './App.css'

/** QR บนการ์ด: https://.../?g=ICE0284 → ไปหน้าโต๊ะพร้อมเมนูครบ */
function QrRedirect() {
  const code = guestQueryParam()
  if (!code) return <HomePage />
  return <Navigate to={`/seat?g=${encodeURIComponent(code)}`} replace />
}

function AppRoutes() {
  const location = useLocation()
  const isRootWithGuest =
    location.pathname === '/' && (location.search.includes('g=') || location.search.includes('guest='))

  return (
    <Routes>
      <Route path="/" element={isRootWithGuest ? <QrRedirect /> : <HomePage />} />
      <Route path="/video" element={<VideoPage />} />
      <Route path="/photos" element={<PhotosPage />} />
      <Route path="/schedule" element={<SchedulePage />} />
      <Route path="/seat" element={<SeatPage />} />
      <Route path="/share" element={<SharePage />} />
      <Route path="/team/upload" element={<PhotographerUploadPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

const routerBase = import.meta.env.BASE_URL.replace(/\/$/, '')

export default function App() {
  return (
    <BrowserRouter basename={routerBase === '' ? undefined : routerBase}>
      <AppRoutes />
    </BrowserRouter>
  )
}
