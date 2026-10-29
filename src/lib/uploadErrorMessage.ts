const MESSAGES: Record<string, string> = {
  drive_upload_not_configured:
    'ระบบอัปโหลดยังไม่เปิด — เจ้าภาพต้องตั้งค่า Google OAuth (npm run drive:oauth)',
  drive_sa_no_quota:
    'อัปโหลดล้มเหลว — ต้องใช้บัญชี Google เจ้าของ Drive (รัน npm run drive:oauth แล้ว deploy)',
  drive_forbidden:
    'ไม่มีสิทธิเขียนโฟลเดอร์ — ตรวจว่าแชร์ Drive กับบัญชีที่ใช้ OAuth แล้ว',
  source_label_required: 'กรุณาระบุชื่อกล้อง / แหล่งที่มา',
  file_too_large: 'ไฟล์ใหญ่เกินกำหนด',
  invalid_mime: 'ชนิดไฟล์ไม่รองรับ',
  rate_limited: 'ส่งบ่อยเกินไป — ลองใหม่ภายหลัง',
  network_error: 'เน็ตขัดข้อง — ลองใหม่',
  upload_failed: 'อัปโหลดไม่สำเร็จ — ลองใหม่หรือติดต่อเจ้าภาพ',
}

export function uploadErrorMessage(code: string): string {
  return MESSAGES[code] ?? MESSAGES.upload_failed
}
