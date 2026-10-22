import type { Request, Response } from 'express'
import { LIST_ALBUM_KEYS, UPLOAD_ALBUM_KEYS } from '../config'
import { folderIdForAlbum, getDrive, isFileUnderFolder } from '../drive'

const ALL_ROOT_KEYS = [...LIST_ALBUM_KEYS, ...UPLOAD_ALBUM_KEYS]

export async function handleFile(req: Request, res: Response): Promise<void> {
  const fileId = String(req.query.fileId ?? '')
  const disposition = req.query.disposition === 'attachment' ? 'attachment' : 'inline'

  if (!fileId) {
    res.status(400).send('missing fileId')
    return
  }

  const drive = getDrive()
  if (!drive) {
    res.status(503).send('drive_not_configured')
    return
  }

  let allowed = false
  for (const key of ALL_ROOT_KEYS) {
    const rootId = folderIdForAlbum(key)
    if (!rootId) continue
    if (await isFileUnderFolder(drive, fileId, rootId)) {
      allowed = true
      break
    }
  }

  if (!allowed) {
    res.status(404).send('not_found')
    return
  }

  const meta = await drive.files.get({
    fileId,
    fields: 'name, mimeType',
    supportsAllDrives: true,
  })

  const fileName = meta.data.name ?? 'download'
  const mime = meta.data.mimeType ?? 'application/octet-stream'

  res.setHeader('Content-Type', mime)
  res.setHeader(
    'Content-Disposition',
    `${disposition}; filename="${encodeURIComponent(fileName)}"`,
  )

  const stream = await drive.files.get(
    { fileId, alt: 'media', supportsAllDrives: true },
    { responseType: 'stream' },
  )

  stream.data
    .on('error', () => {
      if (!res.headersSent) res.status(500).end()
    })
    .pipe(res)
}
