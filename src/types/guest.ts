export type GuestRecord = {
  /** Stable ID — ใส่ใน QR เท่านั้น ไม่เปลี่ยนเมื่อย้ายโต๊ะ */
  id: string
  /** ชื่อที่แสดงบนเว็บ (แก้ได้โดยไม่กระทบ QR) */
  label: string
  table: number
  zone: string
  seats: number
}

export type GuestDatabase = {
  updatedAt: string
  guests: GuestRecord[]
}
