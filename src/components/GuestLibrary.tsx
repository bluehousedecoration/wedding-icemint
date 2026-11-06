import { useCallback, useEffect, useState } from 'react'
import {
  fetchGuestLibrary,
  fetchMyUploads,
  type MediaListItem,
} from '../config/mediaApi'
import { MediaLightbox } from './MediaLightbox'

type GuestLibraryProps = {
  title: string
  kind: 'photo' | 'video'
  scope: 'staff' | 'mine'
  refreshKey?: number
}

export function GuestLibrary({ title, kind, scope, refreshKey = 0 }: GuestLibraryProps) {
  const [items, setItems] = useState<MediaListItem[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const load = useCallback(
    async (nextPage: number, replace: boolean) => {
      if (replace) setLoading(true)
      else setLoadingMore(true)
      setError(null)
      try {
        const result =
          scope === 'staff'
            ? await fetchGuestLibrary(kind, nextPage)
            : await fetchMyUploads(kind, nextPage)
        setItems((current) => (replace ? result.items : [...current, ...result.items]))
        setPage(result.page)
        setHasMore(result.hasMore)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'list_failed')
        if (replace) setItems([])
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [kind, scope],
  )

  useEffect(() => {
    void load(1, true)
  }, [load, refreshKey])

  const empty =
    scope === 'staff'
      ? kind === 'photo'
        ? 'ยังไม่มีรูปจากแขก'
        : 'ยังไม่มีคลิปอวยพรจากแขก'
      : kind === 'photo'
        ? 'ยังไม่มีรูปที่ส่งจากเครื่องนี้'
        : 'ยังไม่มีคลิปที่ส่งจากเครื่องนี้'

  return (
    <section className="guest-library" aria-label={title}>
      <h2 className="section-heading">{title}</h2>
      {scope === 'mine' ? (
        <p className="hint">เห็นได้เฉพาะบนเครื่องนี้ ไม่ต้องสมัครสมาชิก</p>
      ) : (
        <p className="hint">แตะเพื่อดูใหญ่ แล้วกดโหลดได้ทีละไฟล์</p>
      )}
      {loading ? <p className="coming-soon">กำลังโหลด…</p> : null}
      {!loading && error ? <p className="status error">โหลดรายการไม่สำเร็จ</p> : null}
      {!loading && !error && items.length === 0 ? <p className="coming-soon">{empty}</p> : null}
      {items.length > 0 ? (
        <ul className="guest-library-grid">
          {items.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                className="guest-library-open"
                onClick={() => setActiveIndex(index)}
              >
                {item.mime.startsWith('video/') ? (
                  <video src={item.thumbUrl} muted playsInline preload="metadata" />
                ) : (
                  <img src={item.thumbUrl} alt="" />
                )}
              </button>
              <p className="guest-library-name">{item.name}</p>
              <a className="guest-library-download" href={item.downloadUrl}>
                โหลด
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      {hasMore ? (
        <button
          type="button"
          className="action"
          disabled={loadingMore}
          onClick={() => void load(page + 1, false)}
        >
          {loadingMore ? 'กำลังโหลด…' : 'ดูเพิ่ม'}
        </button>
      ) : null}
      <MediaLightbox
        items={items}
        index={activeIndex}
        canPrev={activeIndex != null && activeIndex > 0}
        canNext={activeIndex != null && activeIndex < items.length - 1}
        loadingMore={false}
        onPrev={() => setActiveIndex((current) => (current != null && current > 0 ? current - 1 : current))}
        onNext={() =>
          setActiveIndex((current) =>
            current != null && current < items.length - 1 ? current + 1 : current,
          )
        }
        onClose={() => setActiveIndex(null)}
      />
    </section>
  )
}
