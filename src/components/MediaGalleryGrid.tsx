import { useCallback, useEffect, useRef, useState } from 'react'
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const advanceAfterLoad = useRef(false)

  useEffect(() => {
    if (!advanceAfterLoad.current || activeIndex == null) return
    if (activeIndex < items.length - 1) {
      advanceAfterLoad.current = false
      setActiveIndex(activeIndex + 1)
      return
    }
    if (!loadingMore) advanceAfterLoad.current = false
  }, [items.length, activeIndex, loadingMore])

  const goPrev = useCallback(() => {
    setActiveIndex((current) => (current != null && current > 0 ? current - 1 : current))
  }, [])

  const goNext = useCallback(() => {
    if (activeIndex == null) return
    if (activeIndex < items.length - 1) {
      setActiveIndex(activeIndex + 1)
      return
    }
    if (hasMore && !loadingMore) {
      advanceAfterLoad.current = true
      onLoadMore()
    }
  }, [activeIndex, items.length, hasMore, loadingMore, onLoadMore])

  if (loading && items.length === 0) {
    return (
      <div aria-busy="true">
        <p className="visually-hidden">กำลังโหลดรูป…</p>
        <ul className="album-preview-grid" aria-hidden="true">
          <li className="album-preview-thumb album-preview-skeleton gallery-lead" />
          {Array.from({ length: 4 }, (_, index) => (
            <li key={index} className="album-preview-thumb album-preview-skeleton" />
          ))}
        </ul>
      </div>
    )
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

  const open = activeIndex != null
  const canPrev = open && activeIndex > 0
  const canNext = open && (activeIndex < items.length - 1 || hasMore)

  return (
    <>
      <ul className="album-preview-grid" aria-label="อัลบั้มรูป">
        {items.map((item, index) => (
          <li key={item.id} className={index === 0 ? 'gallery-lead' : undefined}>
            <button
              type="button"
              className="album-preview-thumb album-preview-btn"
              aria-label={`ดูรูป ${index + 1}`}
              onClick={() => setActiveIndex(index)}
            >
              <img src={item.thumbUrl} alt="" loading="lazy" />
            </button>
          </li>
        ))}
      </ul>
      <p className="album-preview-hint">
        {items.length} รูป{hasMore ? '+' : ''} · แตะเพื่อเปิด บีบนิ้วเพื่อซูม
      </p>
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
      <MediaLightbox
        items={items}
        index={activeIndex}
        canPrev={canPrev}
        canNext={canNext}
        loadingMore={loadingMore}
        onPrev={goPrev}
        onNext={goNext}
        onClose={() => {
          advanceAfterLoad.current = false
          setActiveIndex(null)
        }}
      />
    </>
  )
}
