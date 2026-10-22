import type { MediaAlbumKey, MediaListItem } from '../config/mediaApi'
import { publicAssetUrl } from './assetUrl'

/** เนื้อหาตัวอย่างชุดเดียว — จนกว่าจะเชื่อม Drive API */
export function getDemoMediaItems(albumKey: MediaAlbumKey): MediaListItem[] {
  const isVideo =
    albumKey === 'vdo-present' || albumKey === 'vdo-wedding-day'

  if (isVideo) {
    const src = publicAssetUrl('/website_open_1080p4.mp4')
    return [
      {
        id: `demo-${albumKey}-v1`,
        name: 'website_open_1080p4.mp4',
        mime: 'video/mp4',
        viewUrl: src,
        downloadUrl: src,
        thumbUrl: publicAssetUrl('/favicon.png'),
      },
    ]
  }

  const img = publicAssetUrl('/favicon.png')
  return [1, 2, 3, 4, 5, 6].map((n) => ({
    id: `demo-${albumKey}-img-${n}`,
    name: `ตัวอย่าง-${n}.png`,
    mime: 'image/png',
    viewUrl: img,
    downloadUrl: img,
    thumbUrl: img,
  }))
}
