import { useEffect } from 'react'
import type { MediaListItem } from '../config/mediaApi'

type MediaLightboxProps = {
  item: MediaListItem | null
  onClose: () => void
}

export function MediaLightbox({ item, onClose }: MediaLightboxProps) {
  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.classList.add('lightbox-open')
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('lightbox-open')
      window.removeEventListener('keydown', onKey)
    }
  }, [item, onClose])

  if (!item) return null

  const isVideo = item.mime.startsWith('video/')

  return (
    <div className="media-lightbox" role="dialog" aria-modal="true" aria-label={item.name}>
      <button type="button" className="media-lightbox-close" onClick={onClose} aria-label="ปิด">
        ×
      </button>
      <div className="media-lightbox-body">
        {isVideo ? (
          <video controls playsInline src={item.viewUrl} className="media-lightbox-video" />
        ) : (
          <img className="media-lightbox-img" src={item.viewUrl} alt={item.name} />
        )}
      </div>
      <div className="media-lightbox-actions">
        <a className="action primary" href={item.downloadUrl} download={item.name}>
          บันทึกลงเครื่อง
        </a>
      </div>
    </div>
  )
}
