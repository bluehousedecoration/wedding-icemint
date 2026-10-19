import { ExternalButton, PageLayout } from '../components/PageLayout'
import { siteContent } from '../config/siteContent'

export function PhotosPage() {
  return (
    <PageLayout title="รูปภาพ">
      <header className="hero compact">
        <p className="eyebrow">Gallery</p>
        <h1>รูปภาพ</h1>
        <p className="sub">
          กดปุ่มด้านล่างเพื่อเปิดอัลบั้ม — ดูและดาวน์โหลดจาก Google Drive / Photos
        </p>
      </header>

      <ul className="album-list">
        {siteContent.photoAlbums.map((album) => {
          const ready = Boolean(album.viewUrl.trim())
          return (
            <li key={album.id} className="album-card">
              <h2>{album.title}</h2>
              <p>{album.description}</p>
              <ExternalButton
                href={album.viewUrl}
                label={ready ? 'เปิดดู / ดาวน์โหลด' : 'เร็ว ๆ นี้'}
                disabled={!ready}
              />
            </li>
          )
        })}
      </ul>
    </PageLayout>
  )
}
