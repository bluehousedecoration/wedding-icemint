import Busboy from 'busboy'
import type { Request, Response } from 'express'
import { MAX_PHOTO_BYTES, MAX_VIDEO_BYTES } from '../config'
import {
  findOrCreateSubfolder,
  folderIdForAlbum,
  getDrive,
  slugSourceLabel,
} from '../drive'

type ShareType = 'photo' | 'video'

function todayBangkok(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date())
}

export async function handleShare(req: Request, res: Response): Promise<void> {
  const drive = getDrive()
  if (!drive) {
    res.status(503).json({ error: 'drive_not_configured' })
    return
  }

  return new Promise((resolve) => {
    const bb = Busboy({ headers: req.headers, limits: { fileSize: MAX_VIDEO_BYTES + 1024 } })
    let type: ShareType | null = null
    let sourceLabel = ''
    let fileBuffer: Buffer | null = null
    let fileMime = 'application/octet-stream'
    let fileName = 'upload.bin'
    let fileTooLarge = false

    bb.on('field', (name, val) => {
      if (name === 'type') type = val === 'video' ? 'video' : val === 'photo' ? 'photo' : null
      if (name === 'sourceLabel') sourceLabel = String(val)
    })

    bb.on('file', (_name, stream, info) => {
      fileMime = info.mimeType
      fileName = info.filename || fileName
      const chunks: Buffer[] = []
      stream.on('data', (d: Buffer) => chunks.push(d))
      stream.on('limit', () => {
        fileTooLarge = true
      })
      stream.on('end', () => {
        fileBuffer = Buffer.concat(chunks)
      })
    })

    bb.on('error', () => {
      res.status(400).json({ error: 'upload_parse_failed' })
      resolve()
    })

    bb.on('finish', async () => {
      try {
        if (fileTooLarge) {
          res.status(413).json({ error: 'file_too_large' })
          resolve()
          return
        }

        if (!type || !fileBuffer) {
          res.status(400).json({ error: 'missing_file_or_type' })
          resolve()
          return
        }

        const label = sourceLabel.trim()
        if (!label) {
          res.status(400).json({ error: 'source_label_required' })
          resolve()
          return
        }

        const max = type === 'photo' ? MAX_PHOTO_BYTES : MAX_VIDEO_BYTES
        if (fileBuffer.length > max) {
          res.status(413).json({ error: 'file_too_large' })
          resolve()
          return
        }

        if (type === 'photo' && !fileMime.startsWith('image/')) {
          res.status(400).json({ error: 'invalid_mime' })
          resolve()
          return
        }
        if (type === 'video' && !fileMime.startsWith('video/')) {
          res.status(400).json({ error: 'invalid_mime' })
          resolve()
          return
        }

        const albumKey = type === 'photo' ? 'guest-photos' : 'guest-videos'
        const parentId = folderIdForAlbum(albumKey)
        if (!parentId) {
          res.status(503).json({ error: 'album_not_configured' })
          resolve()
          return
        }

        const folderName = `${slugSourceLabel(label)}-${todayBangkok()}`
        const targetFolderId = await findOrCreateSubfolder(drive, parentId, folderName)

        const { Readable } = await import('node:stream')
        const bodyStream = Readable.from(fileBuffer)

        const created = await drive.files.create({
          requestBody: {
            name: fileName,
            parents: [targetFolderId],
          },
          media: {
            mimeType: fileMime,
            body: bodyStream,
          },
          fields: 'id, name',
          supportsAllDrives: true,
        })

        res.json({
          ok: true,
          fileId: created.data.id,
          folderName,
        })
      } catch {
        res.status(500).json({ error: 'upload_failed' })
      }
      resolve()
    })

    req.pipe(bb)
  })
}
