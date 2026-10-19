/**
 * แก้ไฟล์นี้เมื่อมีลิงก์จริง — ไม่ต้องแตะ UI
 * วิดีโอ: ใส่ youtube embed หรือลิงก์ Vimeo
 * รูป: ลิงก์ Google Drive / Google Photos album (Anyone with link)
 * ช่างภาพ: ลิงก์โฟลเดอร์ Drive สำหรับอัปโหลด (แชร์เฉพาะทีมถ่าย)
 */

export type PhotoAlbum = {
  id: string
  title: string
  description: string
  /** ลิงก์เปิดดาวน์โหลด/ดูอัลบั้ม — ว่าง = ยังไม่เปิด */
  viewUrl: string
}

export type ScheduleItem = {
  time: string
  title: string
  detail?: string
}

export type VideoSection = {
  title: string
  subtitle: string
  embedUrl: string
  openUrl: string
}

export const siteContent = {
  couple: 'Ice & Mint',
  coupleFullNames: 'Thanakrit & Arisara',
  tagline: 'Our time. Our love. Our forever.',
  /** การ์ดเชิญ — ไฟล์ใน public/ */
  invitationCardUrl: '/invitation-card.jpg',
  /** แอนิเมชันเปิดการ์ดครั้งแรกต่อ session บนหน้าแรก */
  introEnabled: true,
  weddingDate: '20 December 2026',
  venue: 'AVA TRIVI STUDIO',
  venueAddress:
    '55/24 ตำบลบางพลับ อำเภอปากเกร็ด จังหวัดนนทบุรี 11120 (ถนนราชพฤกษ์)',
  venueMapUrl: 'https://maps.app.goo.gl/zde8YuzuXEmvgBCV6' as string,

  /** VDO Present ก่อนงาน */
  video: {
    title: 'VDO Present',
    subtitle: 'เรื่องราวของเรา',
    embedUrl: '' as string,
    openUrl: '' as string,
  } satisfies VideoSection,

  /** ไฮไลต์ / คลิปหลังงาน */
  eventRecap: {
    title: 'Wedding Day',
    subtitle: 'วิดีโอและไฮไลต์จากงาน',
    embedUrl: '' as string,
    openUrl: '' as string,
  } satisfies VideoSection,

  photoAlbums: [
    {
      id: 'prewedding',
      title: 'Pre-Wedding',
      description: 'ภาพ Pre-Wedding — เปิดดูและดาวน์โหลดได้',
      viewUrl: '',
    },
    {
      id: 'wedding-day',
      title: 'Wedding Day',
      description: 'ภาพวันงาน (เปิดหลังงาน)',
      viewUrl: '',
    },
    {
      id: 'photo-booth',
      title: 'Photo Booth',
      description: 'มุม Photo Booth',
      viewUrl: '',
    },
  ] satisfies PhotoAlbum[],

  photographer: {
    pageTitle: 'อัปโหลดรูป (ทีมถ่ายภาพ)',
    uploadFolderUrl: '' as string,
    instructions: [
      'อัปโหลดไฟล์ลงโฟลเดอร์ Drive ด้านล่าง',
      'ตั้งชื่อโฟลเดอร์ย่อยตามวัน/มุมถ่าย (เช่น ceremony, reception)',
      'เมื่อ sync แล้ว แอดมินจะอัปเดตลิงก์ “ดูรูป” ให้แขกโหลดได้',
    ],
  },

  /** 4 จุดสำหรับพิมพ์บนการ์ดเชิญ */
  scheduleCard: [
    { time: '15:40', title: 'แห่ขันหมาก' },
    { time: '16:29', title: 'พิธีหมั้น (สวมแหวน)' },
    { time: '17:30', title: 'หลั่งน้ำพระพุทธมนต์ (รดน้ำสังข์)' },
    {
      time: '19:00',
      title: 'พิธีฉลองมงคลสมรส หรือรับประทานอาหาร',
    },
  ] satisfies ScheduleItem[],

  /** กำหนดการบ่าย–เย็น (รายละเอียด) */
  scheduleFull: [
    {
      time: '15:30',
      title: 'บ่าวสาว & แขก Stand by @ AVA',
      detail: 'บ่าวสาวถ่ายภาพคู่ / เจ้าภาพรับรองแขก',
    },
    {
      time: '15:40',
      title: 'แห่ขันหมาก',
      detail: 'เจรจาสู่ขอ — รับตัว — มอบสินสอด',
    },
    { time: '16:29', title: 'หมั้น (สวมแหวน)' },
    { time: '16:40', title: 'ยกน้ำชา' },
    {
      time: '17:30',
      title: 'หลั่งน้ำพระพุทธมนต์ (รดน้ำสังข์)',
      detail: 'ถ่ายภาพ',
    },
    { time: '18:20', title: 'บ่าวสาวเปลี่ยนชุดงานเลี้ยงฉลอง' },
    { time: '18:30', title: 'เริ่มเสิร์ฟอาหาร', detail: '18:30–18:45' },
    {
      time: '19:30',
      title: 'พิธีกรนำเข้าสู่พิธีฉลอง',
      detail:
        'กล่าวประวัติ / presentation (ถ้ามี) · เปิดตัวบ่าวสาว · เพื่อนโปรยกลิตเตอร์ (กรวย+กลิตเตอร์ 8 อันในแพ็ค)',
    },
    {
      time: '19:40',
      title: 'ผู้ใหญ่คล้องมาลัย กล่าวอวยพร (ถ้ามี)',
      detail: 'พูดคุยกับบ่าวสาว 3 คำถาม (โดยประมาณ)',
    },
    {
      time: '20:00',
      title: 'จุดเทียน / ตัดเค้ก หรือรินแชมเปญ',
      detail:
        'โยนช่อดอกไม้ หรือดึงริบบิ้น · บ่าวสาวขอบคุณแขก · จบพิธีการ ถ่ายภาพร่วมกับแขก',
    },
  ] satisfies ScheduleItem[],

  /** เฟส 2 — ลิงก์ Google Form / Drive (ว่าง = แสดง “เร็ว ๆ นี้”) */
  guestShare: {
    pageTitle: 'แชร์ความประทับใจ',
    photoFormUrl: '' as string,
    videoMessageFormUrl: '' as string,
    instructions: [
      'อัปโหลดรูปความประทับใจจากงาน',
      'อัดคลิปอวยพรถึงบ่าวสาว (ถ้ามีฟอร์มวิดีโอ)',
    ],
  },
}
