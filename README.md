# Ice & Mint — Wedding Guest Site

เว็บแขกงานแต่ง (React + Vite) — QR โต๊ะ, กำหนดการ, VDO/รูป, แชร์ความประทับใจ

**โดเมน:** [icemintwedding20dec26.com](https://icemintwedding20dec26.com)

## พัฒนาบนเครื่อง

```powershell
cd "D:\003_wedding plan"
npm install
npm run dev
```

รอข้อความ **`Local: http://localhost:5173/`** ในเทอร์มินัล แล้วเปิดลิงก์นั้น (ต้องเป็น **http** ไม่ใช่ https)

- ถ้าเปิดไม่ได้: ปิด process เก่าที่พอร์ต 5173 หรือดูพอร์ตใหม่ที่ Vite แจ้ง (เช่น 5174)
- ทดสอบโต๊ะ: `http://localhost:5173/seat?g=ICE0284`

### Sync รายชื่อแขก (CSV → JSON)

1. วาง export ใน `data/guests.csv` (หรือ Bluehouse JSON → `npm run seating:import -- path\to\export.json`)
2. รัน:

```powershell
npm run guests:build
```

อัปเดต `src/data/guests.json` และ `public/seating.json` (บน dev โหลด `seating.json` ก่อน ERP)

### Export ลิงก์ QR สำหรับ Canva

```powershell
$env:SITE_ORIGIN="https://icemintwedding20dec26.com"
$env:BASE_PATH="/"
npm run qr:export
```

ไฟล์: `data/guest-qr-links.csv`

### Build / Deploy

```powershell
npm run build:pages
```

GitHub Actions workflow deploy อัตโนมัติเมื่อ push `main`

## แก้เนื้อหา (ไม่แตะ UI)

| ไฟล์ | เนื้อหา |
|------|--------|
| [`src/config/siteContent.ts`](src/config/siteContent.ts) | ข้อความ, mediaAlbumKey (ไม่ใส่ URL Drive) |
| [`docs/DRIVE-SETUP-TH.md`](docs/DRIVE-SETUP-TH.md) | **ตั้ง Google Drive + deploy Media API (ภาษาไทย)** |
| [`docs/DRIVE-MEDIA-API.md`](docs/DRIVE-MEDIA-API.md) | รายละเอียด API / ทดสอบ |
| `public/invitation-card.jpg` | ภาพการ์ดเชิญ (intro + หน้าแรก) |
| [`src/config/floorPlan.ts`](src/config/floorPlan.ts) | PNG ผังจาก ERP (ถ้ามี) |

## เอกสาร

- [BLUEHOUSE-SYNC.md](docs/BLUEHOUSE-SYNC.md) — ที่นั่งจาก ERP
- [GUEST-UPLOAD.md](docs/GUEST-UPLOAD.md) — Firebase อัปโหลดรูป/วิดีโอ
- [DEPLOY-CANVA.md](docs/DEPLOY-CANVA.md) — QR บนการ์ด
