import { useState } from 'react'
import { GuestLibrary } from '../components/GuestLibrary'
import { PageLayout } from '../components/PageLayout'
import { StaffGate } from '../components/StaffGate'
import { getMediaApiBase } from '../config/mediaApi'
import { siteContent } from '../config/siteContent'
import { lockStaff } from '../lib/staffAccess'

function teamLink(albumId: string): string {
  const base = getMediaApiBase().replace(/\/$/, '')
  const key = siteContent.photographer.teamKey
  return `${base}/go/${albumId}?k=${encodeURIComponent(key)}`
}

type SettingsCategory = 'upload' | 'guests' | 'photographer'

const categories: { id: SettingsCategory; label: string }[] = [
  { id: 'upload', label: 'อัปโหลด' },
  { id: 'guests', label: 'รูปจากแขก' },
  { id: 'photographer', label: 'ช่างภาพ' },
]

function AlbumCards({
  albums,
  mode,
  copied,
  onCopy,
}: {
  albums: typeof siteContent.photographer.albums
  mode: 'upload' | 'photographer'
  copied: string | null
  onCopy: (albumId: string) => void
}) {
  return (
    <ul className="album-list">
      {albums.map((album) => {
        const href = teamLink(album.id)
        const verb = album.kind === 'video' ? 'อัปโหลดวิดีโอ' : 'อัปโหลดรูป'
        return (
          <li key={album.id} className="album-card">
            <h2>{album.title}</h2>
            <p>{album.detail}</p>
            <div className="stack-actions">
              {mode === 'upload' ? (
                <a className="action primary" href={href} target="_blank" rel="noreferrer">
                  {verb} {album.title}
                </a>
              ) : (
                <button type="button" className="action primary" onClick={() => onCopy(album.id)}>
                  {copied === album.id ? 'คัดลอกลิงก์แล้ว' : 'คัดลอกลิงก์ให้ช่าง'}
                </button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function SettingsBody() {
  const { photographer } = siteContent
  const [category, setCategory] = useState<SettingsCategory>('upload')
  const [copied, setCopied] = useState<string | null>(null)
  const photos = photographer.albums.filter((album) => album.kind === 'photo')
  const videos = photographer.albums.filter((album) => album.kind === 'video')

  async function copyLink(albumId: string) {
    const href = teamLink(albumId)
    try {
      await navigator.clipboard.writeText(href)
      setCopied(albumId)
    } catch {
      setCopied(null)
      window.prompt('คัดลอกลิงก์นี้ส่งให้ช่างภาพ', href)
    }
  }

  return (
    <>
      <header className="hero compact">
        <p className="eyebrow">Settings</p>
        <h1>ตั้งค่า</h1>
        <p className="sub">
          {category === 'upload'
            ? 'ส่งรูปและวิดีโอขึ้นหน้าที่แขกเปิดดู'
            : category === 'guests'
              ? 'ดูและโหลดรูปกับคลิปที่แขกส่งเข้ามา'
              : 'คัดลอกลิงก์ส่งให้ช่างภาพอัปโหลดเอง'}
        </p>
      </header>

      <div className="album-tabs settings-tabs" role="tablist" aria-label="หมวดตั้งค่า">
        {categories.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`settings-tab-${item.id}`}
            aria-selected={category === item.id}
            aria-controls={`settings-panel-${item.id}`}
            className={`album-tab${category === item.id ? ' active' : ''}`}
            onClick={() => setCategory(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {category === 'upload' ? (
        <div id="settings-panel-upload" role="tabpanel" aria-labelledby="settings-tab-upload">
          <section className="schedule-block" aria-labelledby="settings-photo-heading">
            <h2 id="settings-photo-heading" className="section-heading">
              อัปโหลดรูป
            </h2>
            <AlbumCards albums={photos} mode="upload" copied={copied} onCopy={copyLink} />
          </section>
          <section className="schedule-block" aria-labelledby="settings-video-heading">
            <h2 id="settings-video-heading" className="section-heading">
              อัปโหลดวิดีโอ
            </h2>
            <AlbumCards albums={videos} mode="upload" copied={copied} onCopy={copyLink} />
          </section>
        </div>
      ) : null}

      {category === 'guests' ? (
        <div id="settings-panel-guests" role="tabpanel" aria-labelledby="settings-tab-guests">
          <GuestLibrary title="รูปจากแขก" kind="photo" scope="staff" />
          <GuestLibrary title="คลิปอวยพรจากแขก" kind="video" scope="staff" />
        </div>
      ) : null}

      {category === 'photographer' ? (
        <div
          id="settings-panel-photographer"
          role="tabpanel"
          aria-labelledby="settings-tab-photographer"
        >
          <section className="schedule-block" aria-labelledby="settings-photographer-photo">
            <h2 id="settings-photographer-photo" className="section-heading">
              ลิงก์รูป
            </h2>
            <AlbumCards albums={photos} mode="photographer" copied={copied} onCopy={copyLink} />
          </section>
          <section className="schedule-block" aria-labelledby="settings-photographer-video">
            <h2 id="settings-photographer-video" className="section-heading">
              ลิงก์วิดีโอ
            </h2>
            <AlbumCards albums={videos} mode="photographer" copied={copied} onCopy={copyLink} />
          </section>
        </div>
      ) : null}

      <button
        type="button"
        className="action"
        onClick={() => {
          lockStaff()
          window.location.reload()
        }}
      >
        ออกจากส่วนตั้งค่า
      </button>
    </>
  )
}

export function SettingsPage() {
  return (
    <PageLayout title="ตั้งค่า">
      <StaffGate>
        <SettingsBody />
      </StaffGate>
    </PageLayout>
  )
}
