import { useState } from 'react'
import type { MediaListItem } from '../config/mediaApi'
import { MediaLightbox } from './MediaLightbox'

type MediaGalleryGridProps = {
  items: MediaListItem[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadingMore: boolean
  onLoadMore: () => void
  emptyMessage?: string
}

export function MediaGalleryGrid({
  items,
  loading,
  error,
  hasMore,
  loadingMore,
  onLoadMore,
  emptyMessage = 'ยังไม่มีรูปในอัลบั้มนี้',
}: MediaGalleryGridProps) {
  const [active, setActive] = useState<MediaListItem | null>(null)

  if (loading && items.length === 0) {
    return <p className="status">กำลังโหลดรูป…</p>
  }

  if (error && items.length === 0) {
    return (
      <p className="status error">
        โหลดอัลบั้มไม่สำเร็จ — ลองใหม่ภายหลัง
        {import.meta.env.DEV ? ` (${error})` : null}
      </p>
    )
  }

  if (items.length === 0) {
    return <p className="coming-soon">{emptyMessage}</p>
  }

  return (
    <>
      <ul className="album-preview-grid" aria-label="อัลบั้มรูป">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="album-preview-thumb album-preview-btn"
              onClick={() => setActive(item)}
            >
              <img src={item.thumbUrl} alt={item.name} loading="lazy" />
            </button>
          </li>
        ))}
      </ul>
      <p className="album-preview-hint">แตะรูปเพื่อดูใหญ่ — กดบันทึกลงเครื่องในหน้าถัดไป</p>
      {hasMore ? (
        <button
          type="button"
          className="action album-load-more"
          onClick={onLoadMore}
          disabled={loadingMore}
        >
          {loadingMore ? 'กำลังโหลด…' : 'ดูเพิ่ม'}
        </button>
      ) : null}
      <MediaLightbox item={active} onClose={() => setActive(null)} />
    </>
  )
}
