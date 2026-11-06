import { useState } from 'react'
import { GuestLibrary } from '../components/GuestLibrary'
import { GuestPhotoUpload } from '../components/GuestPhotoUpload'
import { GuestUploadStatus } from '../components/GuestUploadStatus'
import { PageLayout } from '../components/PageLayout'
import { siteContent } from '../config/siteContent'

export function SharePage() {
  const { guestShare } = siteContent
  const [sent, setSent] = useState(0)

  return (
    <PageLayout title="แชร์">
      <header className="hero compact">
        <p className="eyebrow">Share</p>
        <h1>{guestShare.pageTitle}</h1>
        <p className="sub">ส่งรูปโมเมนต์ถึง Ice & Mint — เก็บในอัลบั้มของงานทันที</p>
      </header>

      <ol className="instruction-list">
        <li>กรอกชื่อกล้อง / แหล่งที่มา (เพื่อจัดเก็บเป็นโฟลเดอร์)</li>
        <li>เลือกรูปจากมือถือ</li>
        <li>กดส่งรูปให้บ่าวสาว</li>
      </ol>

      <GuestUploadStatus>
        <GuestPhotoUpload onUploaded={() => setSent((count) => count + 1)} />
      </GuestUploadStatus>

      <GuestLibrary
        title="รูปที่ส่งจากเครื่องนี้"
        kind="photo"
        scope="mine"
        refreshKey={sent}
      />
    </PageLayout>
  )
}
