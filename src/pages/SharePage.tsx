import { useState } from 'react'
import { GuestPhotoUpload } from '../components/GuestPhotoUpload'
import { GuestVideoRecorder } from '../components/GuestVideoRecorder'
import { ExternalButton, PageLayout } from '../components/PageLayout'
import { isFirebaseConfigured } from '../config/uploadConfig'
import { siteContent } from '../config/siteContent'

type ShareTab = 'photo' | 'video'

export function SharePage() {
  const { guestShare } = siteContent
  const uploadReady = isFirebaseConfigured()
  const photoForm = guestShare.photoFormUrl.trim()
  const videoForm = guestShare.videoMessageFormUrl.trim()
  const [tab, setTab] = useState<ShareTab>('photo')

  return (
    <PageLayout title="แชร์ความประทับใจ">
      <header className="hero compact">
        <p className="eyebrow">Share</p>
        <h1>{guestShare.pageTitle}</h1>
        <p className="sub">ส่งรูปและคลิปอวยพรถึง Ice & Mint</p>
      </header>

      <ol className="instruction-list">
        <li>เลือกแท็บรูปภาพ หรือวิดีโออวยพร</li>
        <li>อนุญาตกล้อง/ไมค์ (วิดีโอ) หรือเลือกรูปจากมือถือ</li>
        <li>กดส่ง — บ่าวสาวจะได้รับในระบบ cloud</li>
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
            โหมดอัปโหลดบนเว็บกำลังเปิด — บ่าวสาวตั้งค่า Firebase ตาม{' '}
            <code>docs/GUEST-UPLOAD.md</code>
          </p>
          {(photoForm || videoForm) && (
            <div className="stack-actions">
              {photoForm ? (
                <ExternalButton href={photoForm} label="อัปโหลดรูป (ลิงก์สำรอง)" />
              ) : null}
              {videoForm ? (
                <ExternalButton href={videoForm} label="ส่งวิดีโอ (ลิงก์สำรอง)" />
              ) : null}
            </div>
          )}
        </div>
      )}
    </PageLayout>
  )
}
