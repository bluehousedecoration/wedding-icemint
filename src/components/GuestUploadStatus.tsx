import type { ReactNode } from 'react'
import { isMediaApiConfigured } from '../config/mediaApi'
import { siteContent } from '../config/siteContent'
import { useGuestShareUploadReady } from '../hooks/useGuestShareUploadReady'

export function GuestUploadStatus({ children }: { children: ReactNode }) {
  const { guestShare } = siteContent
  const uploadStatus = useGuestShareUploadReady()

  if (uploadStatus === 'loading') {
    return (
      <p className="coming-soon" role="status">
        กำลังตรวจสอบระบบอัปโหลด…
      </p>
    )
  }

  if (uploadStatus === 'ready') return children

  if (uploadStatus === 'oauth_pending') {
    return (
      <div className="upload-setup-notice">
        <p className="coming-soon">ระบบรับไฟล์ยังไม่พร้อม — ตรวจการเชื่อมถังเก็บรูปแล้วลองใหม่</p>
        {guestShare.photoFormUrl.trim() ? (
          <p className="hint">
            ส่งรูปสำรอง:{' '}
            <a href={guestShare.photoFormUrl} target="_blank" rel="noreferrer">
              Google Form
            </a>
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="upload-setup-notice">
      <p className="coming-soon">
        เปิดอัปโหลดเมื่อเชื่อมถังเก็บรูปแล้ว
        {isMediaApiConfigured() ? null : ' หรือตั้ง Firebase ตาม docs/GUEST-UPLOAD.md'}
      </p>
    </div>
  )
}
