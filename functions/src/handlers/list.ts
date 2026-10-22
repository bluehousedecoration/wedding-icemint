import type { drive_v3 } from 'googleapis'
import type { Request, Response } from 'express'
import { LIST_ALBUM_KEYS } from '../config'
import { folderIdForAlbum, getDrive } from '../drive'

const IMAGE_PREFIX = 'image/'
const VIDEO_PREFIX = 'video/'

function isListAlbum(album: string): album is (typeof LIST_ALBUM_KEYS)[number] {
  return (LIST_ALBUM_KEYS as readonly string[]).includes(album)
}

function wantsVideo(album: string): boolean {
  return album.startsWith('vdo-')
}

export async function handleList(req: Request, res: Response, publicBase: string): Promise<void> {
  const album = String(req.query.album ?? '')
  const pageSize = Math.min(20, Math.max(1, Number(req.query.pageSize) || 10))
  const page = Math.max(1, Number(req.query.page) || 1)

  if (!isListAlbum(album)) {
    res.status(400).json({ error: 'invalid_album' })
    return
  }

  const folderId = folderIdForAlbum(album)
  if (!folderId) {
    res.status(503).json({ error: 'album_not_configured' })
    return
  }

  const drive = getDrive()
  if (!drive) {
    res.status(503).json({ error: 'drive_not_configured' })
    return
  }

  const videoMode = wantsVideo(album)
  let pageToken: string | undefined
  const collected: drive_v3.Schema$File[] = []

  const skip = (page - 1) * pageSize
  let matched = 0
  let hasMore = false

  while (collected.length < pageSize) {
    const listRes = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime)',
      pageSize: 100,
      pageToken,
      orderBy: 'modifiedTime desc',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    })

    const files = listRes.data.files ?? []
    if (files.length === 0 && !listRes.data.nextPageToken) break

    for (const f of files) {
      if (!f.id || !f.mimeType) continue
      if (f.mimeType === 'application/vnd.google-apps.folder') continue
      const isVideo = f.mimeType.startsWith(VIDEO_PREFIX)
      const isImage = f.mimeType.startsWith(IMAGE_PREFIX)
      if (videoMode && !isVideo) continue
      if (!videoMode && !isImage) continue
      matched++
      if (matched > skip && collected.length < pageSize) {
        collected.push(f)
      }
    }

    pageToken = listRes.data.nextPageToken ?? undefined
    if (collected.length >= pageSize && pageToken) {
      hasMore = true
      break
    }
    if (!pageToken) break
  }

  const items = collected.map((f) => {
    const fileId = f.id!
    const qInline = `fileId=${encodeURIComponent(fileId)}&disposition=inline`
    const qDl = `fileId=${encodeURIComponent(fileId)}&disposition=attachment`
    return {
      id: fileId,
      name: f.name ?? 'file',
      mime: f.mimeType ?? 'application/octet-stream',
      viewUrl: `${publicBase}/media/file?${qInline}`,
      downloadUrl: `${publicBase}/media/file?${qDl}`,
      thumbUrl: `${publicBase}/media/file?${qInline}`,
    }
  })

  res.json({
    album,
    page,
    pageSize,
    hasMore,
    items,
  })
}
