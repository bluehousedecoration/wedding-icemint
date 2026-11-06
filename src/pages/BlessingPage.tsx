import { useState } from 'react'
import { GuestLibrary } from '../components/GuestLibrary'
import { GuestUploadStatus } from '../components/GuestUploadStatus'
import { GuestVideoRecorder } from '../components/GuestVideoRecorder'
import { PageLayout } from '../components/PageLayout'

export function BlessingPage() {
  const [sent, setSent] = useState(0)

  return (
    <PageLayout title="อวยพร">
      <header className="hero compact">
        <p className="eyebrow">Blessing</p>
        <h1>อวยพรบ่าวสาว</h1>
        <p className="sub">อัดคลิปอวยพรสั้น ๆ ส่งถึง Ice & Mint — เก็บแยกจากรูปความประทับใจ</p>
      </header>

      <ol className="instruction-list">
        <li>กรอกชื่อกล้อง / แหล่งที่มา</li>
        <li>อนุญาตกล้องและไมค์ แล้วอัดคำอวยพร</li>
        <li>กดส่งคลิปให้บ่าวสาว</li>
      </ol>

      <GuestUploadStatus>
        <GuestVideoRecorder onUploaded={() => setSent((count) => count + 1)} />
      </GuestUploadStatus>

      <GuestLibrary
        title="คลิปที่ส่งจากเครื่องนี้"
        kind="video"
        scope="mine"
        refreshKey={sent}
      />
    </PageLayout>
  )
}
