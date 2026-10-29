/**
 * แก้ไฟล์นี้เมื่อมีเนื้อหา — ไม่ต้องแตะ UI
 * รูป/VDO/แชร์: โฟลเดอร์ Drive อยู่ฝั่ง Cloud Functions เท่านั้น (docs/DRIVE-MEDIA-API.md)
 * ใช้ mediaAlbumKey ชี้ไปอัลบั้ม — ไม่ใส่ URL Drive ในไฟล์นี้
 */
import type { MediaAlbumKey } from './mediaApi'

export type PhotoAlbum = {
  id: string
  title: string
  description: string
  /** คีย์อัลบั้มบน Media API */
  mediaAlbumKey?: MediaAlbumKey
}

export type ScheduleItem = {
  time: string
  title: string
  detail?: string
}

export type VideoSection = {
  title: string
  subtitle: string
  mediaAlbumKey?: Extract<MediaAlbumKey, 'vdo-present' | 'vdo-wedding-day'>
}

export type HomeMenuItem = {
  id: string
  label: string
  detail?: string
  to?: string
  /** ใช้ venueMapUrl จาก siteContent */
  mapLink?: boolean
  primary?: boolean
}

export const siteContent = {
  couple: 'Ice & Mint',
  coupleFullNames: 'Thanakrit & Arisara',
  /** โลโก้แถบเมนูด้านบน (public/) */
  menuBarLogoUrl: '/logo-menu-bar.png',
  /** แถบด้านบนทุกหน้า — ใต้ชื่อคู่ */
  headerDateLine: '20 December 2026',
  tagline: 'Our time. Our love. Our forever.',

  /** ปุ่มเมนูหน้าแรก */
  homeMenu: [
    {
      id: 'video',
      label: 'VDO Present',
      detail: 'สามารถดูได้ในวันจริง',
      to: '/video',
      primary: true,
    },
    {
      id: 'photos',
      label: 'รูปภาพ / Pre-Wedding',
      detail: 'ดูรูปภาพ prewedding ของบ่าวสาว',
      to: '/photos',
    },
    {
      id: 'seat',
      label: 'โต๊ะของฉัน',
      detail: 'สามารถพิมพ์ชื่อของท่านในการ์ดเพื่อหาโต๊ะที่นั่ง',
      to: '/seat',
    },
    {
      id: 'schedule',
      label: 'กำหนดการ',
      detail: 'ดูกำหนดการของงาน',
      to: '/schedule',
    },
    {
      id: 'share',
      label: 'แชร์รูปความประทับใจ',
      detail: 'จากโทรศัพท์คุณให้บ่าวสาว',
      to: '/share',
    },
    {
      id: 'map',
      label: 'แผนที่',
      detail: 'กดเพื่อดูรายละเอียดจาก Google Map',
      mapLink: true,
    },
  ] satisfies HomeMenuItem[],
  /** การ์ดเชิญ v2 — PDF ใน public (เรนเดอร์หน้า–หลังบนเว็บ) */
  invitationCardPdfUrl: '/wedding-card2.pdf',
  /** ลำดับหน้า wedding card2.pdf (เริ่มที่ 1): 1=ปก Ice&Mint · 2=Water Blessing ด้านหลัง */
  invitationPdfFrontPage: 1,
  invitationPdfBackPage: 2,
  /** สำรอง JPG ถ้า PDF โหลดไม่ได้ */
  invitationCardUrl: '/invitation-card.jpg',
  /** แอนิเมชันเปิดการ์ดครั้งแรกต่อ session บนหน้าแรก */
  introEnabled: true,
  /** VDO เปิดเว็บ (public/) — มีไฟล์จะใช้แทนแอนิเมชันการ์ด */
  introVideoUrl: '/website_open_1080p4.mp4',
  /** true = แสดงรูป/VDO ตัวอย่างเมื่อยังไม่ตั้ง VITE_MEDIA_API_BASE */
  mediaDemoUntilDriveReady: true,
  weddingDate: '20 December 2026',
  /** ISO 8601 — ใช้นับถอยหลังบนหน้าแรก (เวลา stand by งาน) */
  countdownTarget: '2026-12-20T15:30:00+07:00',
  venue: 'AVA TRIVI STUDIO',
  venueAddress:
    '55/24 ตำบลบางพลับ อำเภอปากเกร็ด จังหวัดนนทบุรี 11120 (ถนนราชพฤกษ์)',
  venueMapUrl: 'https://maps.app.goo.gl/zde8YuzuXEmvgBCV6' as string,

  /** ภาพหน้ากำหนดการ (public/) */
  scheduleTopImageUrl: '/schedule-top.png',
  scheduleBottomImageUrl: '/schedule-bottom.png',

  /** JSON ที่นั่ง live จาก Bluehouse — ว่าง = ใช้แค่ env / seating.json บน Pages */
  seatingLiveJsonUrl:
    'https://erp.bluehousedecoration.com/wedding/seating/guest-seating.json' as string,

  themeColors: {
    title: 'Theme colors',
    subtitle: '',
    items: [
      'หลีกเลี่ยงชุดสีขาวล้วน (สงวนให้เจ้าบ่าวเจ้าสาว)',
      'รองเท้าสบาย ๆ',
    ],
  },

  /** VDO Present ก่อนงาน */
  video: {
    title: 'VDO Present',
    subtitle: 'เรื่องราวของเรา',
    mediaAlbumKey: 'vdo-present',
  } satisfies VideoSection,

  /** ไฮไลต์ / คลิปหลังงาน */
  eventRecap: {
    title: 'Wedding Day',
    subtitle: 'วิดีโอและไฮไลต์จากงาน',
    mediaAlbumKey: 'vdo-wedding-day',
  } satisfies VideoSection,

  photoAlbums: [
    {
      id: 'prewedding',
      title: 'Pre-Wedding',
      description: 'ภาพ Pre-Wedding — ดูและบันทึกลงเครื่องได้',
      mediaAlbumKey: 'prewedding',
    },
    {
      id: 'wedding-day',
      title: 'Wedding Day',
      description: 'ภาพจากช่างภาพในวันงาน — แตะรูปเพื่อดูใหญ่และดาวน์โหลด',
      mediaAlbumKey: 'wedding-day',
    },
    {
      id: 'wedding-backdrop',
      title: 'Wedding Backdrop ทางเข้า',
      description: 'ภาพบริเวณ Backdrop ทางเข้างาน',
      mediaAlbumKey: 'wedding-backdrop',
    },
  ] satisfies PhotoAlbum[],

  photographer: {
    pageTitle: 'อัปโหลดรูป (ทีมถ่ายภาพ)',
    /** ลิงก์โฟลเดอร์ Drive — ช่างอัปโหลดตรงใน Drive (ไม่ผ่าน Media API) */
    uploadFolderUrl: '' as string,
    instructions: [
      'กดปุ่มด้านล่าง → เปิด Google Drive ของทีมถ่าย',
      'อัปโหลดรูปลงโฟลเดอร์โดยตรง (ลากไฟล์หรือปุ่ม New → File upload)',
      'แยกโฟลเดอร์ย่อยตามวัน/มุมถ่าย (เช่น ceremony, reception) ตามที่ทีมตกลง',
      'รูปที่แขกเห็นบนเว็บมาจากโฟลเดอร์ที่ sync กับ Media API — ไม่ใช่โฟลเดอร์นี้โดยอัตโนมัติ',
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
    { time: '21:00', title: 'after party' },
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
