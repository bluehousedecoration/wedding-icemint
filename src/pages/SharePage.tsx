import { useState } from 'react'
import { GuestPhotoUpload } from '../components/GuestPhotoUpload'
import { GuestVideoRecorder } from '../components/GuestVideoRecorder'
import { PageLayout } from '../components/PageLayout'
import { isMediaApiConfigured } from '../config/mediaApi'
import { isGuestShareUploadReady } from '../config/uploadConfig'
import { siteContent } from '../config/siteContent'

type ShareTab = 'photo' | 'video'

export function SharePage() {
  const { guestShare } = siteContent
  const uploadReady = isGuestShareUploadReady()
  const [tab, setTab] = useState<ShareTab>('photo')

  return (
    <PageLayout title="แชร์ความประทับใจ">
      <header className="hero compact">
        <p className="eyebrow">Share</p>
        <h1>{guestShare.pageTitle}</h1>
        <p className="sub">ส่งรูปและคลิปอวยพรถึง Ice & Mint — ผ่านเว็บเท่านั้น</p>
      </header>

      <ol className="instruction-list">
        <li>กรอกชื่อกล้อง / แหล่งที่มา (เพื่อจัดเก็บเป็นโฟลเดอร์)</li>
        <li>เลือกแท็บรูปภาพ หรือวิดีโออวยพร</li>
        <li>อนุญาตกล้อง/ไมค์ (วิดีโอ) หรือเลือกรูปจากมือถือ แล้วกดส่ง</li>
      </ol>

      <div className="share-tabs" role="tablist" aria-label="ประเภทการแชร์">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'photo'}
          className={`share-tab${tab === 'photo' ? ' active' : ''}`}
          onClick={() => setTab('photo')}
        >
          รูปความประทับใจ
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'video'}
          className={`share-tab${tab === 'video' ? ' active' : ''}`}
          onClick={() => setTab('video')}
        >
          อัดวิดีโออวยพร
        </button>
      </div>

      {uploadReady ? (
        <div role="tabpanel">
          {tab === 'photo' ? <GuestPhotoUpload /> : <GuestVideoRecorder />}
        </div>
      ) : (
        <div className="upload-setup-notice">
          <p className="coming-soon">
            เปิดอัปโหลดเมื่อ deploy Media API (Drive) — ดู{' '}
            <code>docs/DRIVE-MEDIA-API.md</code>
            {isMediaApiConfigured() ? null : ' หรือตั้ง Firebase ตาม docs/GUEST-UPLOAD.md'}
          </p>
        </div>
      )}
    </PageLayout>
  )
}
