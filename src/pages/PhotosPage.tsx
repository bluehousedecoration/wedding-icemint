import { useState } from 'react'
import { MediaAlbumSection } from '../components/MediaAlbumSection'
import { PageLayout } from '../components/PageLayout'
import { isMediaApiConfigured } from '../config/mediaApi'
import { siteContent } from '../config/siteContent'

const albumTabLabel: Record<string, string> = {
  prewedding: 'Pre-Wedding',
  'wedding-day': 'วันงาน',
}

export function PhotosPage() {
  const apiReady = isMediaApiConfigured()
  const demo = siteContent.mediaDemoUntilDriveReady !== false && !apiReady
  const albums = siteContent.photoAlbums
  const [albumId, setAlbumId] = useState(albums[0]?.id ?? '')
  const album = albums.find((item) => item.id === albumId) ?? albums[0]

  return (
    <PageLayout title="รูปภาพ" contentClassName="page page--gallery">
      <header className="hero compact gallery-hero">
        <p className="eyebrow">Gallery</p>
        <h1>รูปภาพ</h1>
        <p className="sub">
          {apiReady
            ? 'แตะรูปเพื่อดูใหญ่ บีบนิ้วเพื่อซูม และบันทึกลงเครื่องได้'
            : demo
              ? 'แสดงตัวอย่างชั่วคราว — ตั้ง Drive ตาม docs/DRIVE-SETUP-TH.md'
              : 'กำลังเชื่อมอัลบั้มจากช่างภาพ'}
        </p>
      </header>

      {albums.length > 1 ? (
        <div className="album-tabs" role="tablist" aria-label="อัลบั้มรูป">
          {albums.map((item) => {
            const selected = item.id === album?.id
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`album-tab-${item.id}`}
                aria-selected={selected}
                aria-controls="album-panel"
                className={`album-tab${selected ? ' active' : ''}`}
                onClick={() => setAlbumId(item.id)}
              >
                {albumTabLabel[item.id] ?? item.title}
              </button>
            )
          })}
        </div>
      ) : null}

      {album ? (
        <section
          id="album-panel"
          className="gallery-sheet"
          role="tabpanel"
          aria-labelledby={`album-tab-${album.id}`}
        >
          <p className="gallery-kicker">{album.title}</p>
          <p className="gallery-caption">{album.description}</p>
          {album.mediaAlbumKey ? (
            <MediaAlbumSection key={album.id} album={album} />
          ) : (
            <p className="coming-soon">เร็ว ๆ นี้</p>
          )}
        </section>
      ) : null}
    </PageLayout>
  )
}

