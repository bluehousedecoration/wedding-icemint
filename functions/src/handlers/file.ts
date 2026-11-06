import type { Request, Response } from 'express'
import { getMediaBucket, mimeOf, objectNameFromId } from '../gcsMedia'

export async function handleFile(req: Request, res: Response): Promise<void> {
  const fileId = String(req.query.fileId ?? '')
  const disposition = req.query.disposition === 'attachment' ? 'attachment' : 'inline'
  const objectName = objectNameFromId(fileId)

  if (!objectName) {
    res.status(400).send('missing fileId')
    return
  }

  const bucket = getMediaBucket()
  if (!bucket) {
    res.status(503).send('storage_not_configured')
    return
  }

  const file = bucket.file(objectName)
  const [exists] = await file.exists()
  if (!exists) {
    res.status(404).send('not_found')
    return
  }

  const [meta] = await file.getMetadata()
  const fileName = objectName.split('/').pop() || 'download'
  const mime = meta.contentType || mimeOf(file)

  res.setHeader('Content-Type', mime)
  res.setHeader('Content-Disposition', `${disposition}; filename="${encodeURIComponent(fileName)}"`)
  res.setHeader('Cache-Control', 'private, max-age=300')

  file
    .createReadStream()
    .on('error', () => {
      if (!res.headersSent) res.status(500).end()
    })
    .pipe(res)
}
