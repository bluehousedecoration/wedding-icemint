export type GuestRecord = {
  /** Stable ID — ใส่ใน QR เท่านั้น ไม่เปลี่ยนเมื่อย้ายโต๊ะ */
  id: string
  /** ชื่อที่แสดงบนเว็บ (แก้ได้โดยไม่กระทบ QR) */
  label: string
  table: number
  zone: string
  seats: number
  /** ชื่อโต๊ะจาก Bluehouse */
  tableName?: string
  /** ที่นั่งย่อย เช่น โต๊ะ21-ที่นั่ง3 */
  seatLabel?: string
}

export type GuestDatabase = {
  updatedAt: string
  source?: string
  guests: GuestRecord[]
}
