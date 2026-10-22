import type { PhotoAlbum } from '../config/siteContent'
import type { MediaAlbumKey } from '../config/mediaApi'
import { useMediaAlbum } from '../hooks/useMediaAlbum'
import { MediaGalleryGrid } from './MediaGalleryGrid'

type MediaAlbumSectionProps = {
  album: PhotoAlbum
}

function resolveAlbumKey(album: PhotoAlbum): MediaAlbumKey | undefined {
  return album.mediaAlbumKey
}

export function MediaAlbumSection({ album }: MediaAlbumSectionProps) {
  const key = resolveAlbumKey(album)
  const { items, loading, error, hasMore, loadMore, loadingMore, enabled, demoMode } =
    useMediaAlbum(key, 10)

  if (!key) return null

  if (!enabled) return null

  return (
    <>
      {demoMode ? (
        <p className="hint media-demo-banner" role="status">
          ตัวอย่างชั่วคราว — เมื่อตั้ง Drive แล้วดู{' '}
          <code>docs/DRIVE-SETUP-TH.md</code>
        </p>
      ) : null}
      <MediaGalleryGrid
      items={items}
      loading={loading}
      error={error}
      hasMore={hasMore}
      loadingMore={loadingMore}
      onLoadMore={loadMore}
      emptyMessage={
        album.id === 'wedding-day'
          ? 'ยังไม่มีรูปจากช่างภาพ — จะแสดงที่นี่เมื่ออัปโหลดแล้ว'
          : 'ยังไม่มีรูปในอัลบั้มนี้'
      }
    />
    </>
  )
}
