import { google, drive_v3 } from 'googleapis'
import { getAlbumsMap } from './config'

let driveClient: drive_v3.Drive | null = null

function getCredentials(): object | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw?.trim()) return null
  try {
    return JSON.parse(raw) as object
  } catch {
    return null
  }
}

export function getDrive(): drive_v3.Drive | null {
  if (driveClient) return driveClient
  const credentials = getCredentials()
  if (!credentials) return null
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
  })
  driveClient = google.drive({ version: 'v3', auth })
  return driveClient
}

export function folderIdForAlbum(albumKey: string): string | null {
  const id = getAlbumsMap()[albumKey]?.trim()
  return id || null
}

export async function isFileUnderFolder(
  drive: drive_v3.Drive,
  fileId: string,
  rootFolderId: string,
): Promise<boolean> {
  let current: string | null = fileId
  for (let depth = 0; depth < 12 && current; depth++) {
    const meta = await drive.files.get({
      fileId: current,
      fields: 'id, parents, mimeType',
      supportsAllDrives: true,
    })
    const parents: string[] = meta.data.parents ?? []
    if (parents.includes(rootFolderId)) return true
    if (parents.length === 0) return false
    current = parents[0] ?? null
  }
  return false
}

export async function findOrCreateSubfolder(
  drive: drive_v3.Drive,
  parentId: string,
  folderName: string,
): Promise<string> {
  const q = [
    `'${parentId}' in parents`,
    `name='${folderName.replace(/'/g, "\\'")}'`,
    "mimeType='application/vnd.google-apps.folder'",
    'trashed=false',
  ].join(' and ')

  const existing = await drive.files.list({
    q,
    fields: 'files(id)',
    pageSize: 1,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  })

  const found = existing.data.files?.[0]?.id
  if (found) return found

  const created = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    },
    fields: 'id',
    supportsAllDrives: true,
  })

  const id = created.data.id
  if (!id) throw new Error('create_folder_failed')
  return id
}

export function slugSourceLabel(label: string): string {
  const s = label
    .trim()
    .slice(0, 48)
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
  return s || 'guest'
}
