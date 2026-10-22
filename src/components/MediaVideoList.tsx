import { useState } from 'react'
import type { MediaListItem } from '../config/mediaApi'
import { useMediaAlbum } from '../hooks/useMediaAlbum'
import type { MediaAlbumKey } from '../config/mediaApi'
import { MediaLightbox } from './MediaLightbox'

type MediaVideoListProps = {
  albumKey: MediaAlbumKey
  emptyMessage?: string
}

export function MediaVideoList({
  albumKey,
  emptyMessage = 'วิดีโอจะเปิดให้ชมเร็ว ๆ นี้',
}: MediaVideoListProps) {
  const { items, loading, error, hasMore, loadMore, loadingMore, enabled, demoMode } =
    useMediaAlbum(albumKey, 10)
  const [active, setActive] = useState<MediaListItem | null>(null)

  if (!enabled) {
    return <p className="coming-soon">{emptyMessage}</p>
  }

  if (loading && items.length === 0) {
    return <p className="status">กำลังโหลดวิดีโอ…</p>
  }

  if (error && items.length === 0) {
    return <p className="status error">โหลดวิดีโอไม่สำเร็จ</p>
  }

  if (items.length === 0) {
    return <p className="coming-soon">{emptyMessage}</p>
  }

  return (
    <div className="media-video-list">
      {demoMode ? (
        <p className="hint media-demo-banner" role="status">
          ตัวอย่างวิดีโอชั่วคราว — ตั้ง Drive แล้วจะแทนที่ด้วยไฟล์จริง
        </p>
      ) : null}
      {items.map((item) => (
        <article key={item.id} className="media-video-card">
          <video controls playsInline preload="metadata" src={item.viewUrl} className="media-video-player" />
          <p className="media-video-name">{item.name}</p>
          <div className="stack-actions">
            <button type="button" className="action" onClick={() => setActive(item)}>
              ขยายเต็มจอ
            </button>
            <a className="action primary" href={item.downloadUrl} download={item.name}>
              ดาวน์โหลด
            </a>
          </div>
        </article>
      ))}
      {hasMore ? (
        <button type="button" className="action album-load-more" onClick={loadMore} disabled={loadingMore}>
          {loadingMore ? 'กำลังโหลด…' : 'โหลดวิดีโอเพิ่ม'}
        </button>
      ) : null}
      <MediaLightbox item={active} onClose={() => setActive(null)} />
    </div>
  )
}
