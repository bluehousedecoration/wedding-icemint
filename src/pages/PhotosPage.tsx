import { MediaAlbumSection } from '../components/MediaAlbumSection'
import { PageLayout } from '../components/PageLayout'
import { isMediaApiConfigured } from '../config/mediaApi'
import { siteContent } from '../config/siteContent'

export function PhotosPage() {
  const apiReady = isMediaApiConfigured()
  const demo = siteContent.mediaDemoUntilDriveReady !== false && !apiReady

  return (
    <PageLayout title="รูปภาพ">
      <header className="hero compact">
        <p className="eyebrow">Gallery</p>
        <h1>รูปภาพ</h1>
        <p className="sub">
          {apiReady
            ? 'ดูและบันทึกรูปบนหน้านี้ — ไม่ต้องเปิด Google Drive'
            : demo
              ? 'แสดงตัวอย่างชั่วคราว — ตั้ง Drive ตาม docs/DRIVE-SETUP-TH.md'
              : 'กำลังเชื่อมอัลบั้มจากช่างภาพ'}
        </p>
      </header>

      <ul className="album-list">
        {siteContent.photoAlbums.map((album) => (
          <li key={album.id} className="album-card">
            <h2>{album.title}</h2>
            <p>{album.description}</p>
            {album.mediaAlbumKey ? (
              <MediaAlbumSection album={album} />
            ) : (
              <p className="coming-soon">เร็ว ๆ นี้</p>
            )}
          </li>
        ))}
      </ul>
    </PageLayout>
  )
}
