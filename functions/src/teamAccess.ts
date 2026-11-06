/** รหัสในลิงก์อัปโหลดทีมงาน — ใช้ค่าเดียวกันในหน้าเว็บ */
export const TEAM_UPLOAD_TOKEN = 'b7e4c1a9f2d84e60'

export const TEAM_ALBUMS = {
  prewedding: { title: 'Pre-Wedding', kind: 'photo' },
  'wedding-day': { title: 'ภาพวันงาน', kind: 'photo' },
  'wedding-backdrop': { title: 'ภาพ Backdrop ทางเข้า', kind: 'photo' },
  'vdo-present': { title: 'VDO Present', kind: 'video' },
  'vdo-wedding-day': { title: 'วิดีโอวันงาน', kind: 'video' },
} as const

export type TeamAlbum = keyof typeof TEAM_ALBUMS

export const MAX_TEAM_PHOTO_BYTES = 25 * 1024 * 1024

export function isTeamAlbum(value: string): value is TeamAlbum {
  return Object.prototype.hasOwnProperty.call(TEAM_ALBUMS, value)
}

export function teamTokenMatches(value: string): boolean {
  const given = value.trim()
  if (!given || given.length !== TEAM_UPLOAD_TOKEN.length) return false
  let diff = 0
  for (let i = 0; i < given.length; i++) {
    diff |= given.charCodeAt(i) ^ TEAM_UPLOAD_TOKEN.charCodeAt(i)
  }
  return diff === 0
}
