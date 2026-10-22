# Media API — Google Drive ผ่านเว็บ (แขกไม่เห็นลิงก์ Drive)

แขกดู/ดาวน์โหลดรูปและ VDO บน `/photos` และ `/video` และอัปโหลดแชร์ที่ `/share` — **ไม่มี** `drive.google.com` ใน UI

Backend: **Firebase Cloud Functions** ใน [`functions/`](../functions/) + **Service Account**

## 1. Google Cloud / Service Account

1. [Firebase Console](https://console.firebase.google.com/) → โปรเจกต์เดียวกับ Storage (ถ้ามี)
2. Google Cloud Console → **IAM → Service Accounts** → สร้าง SA → สร้าง JSON key (เก็บปลอดภัย **อย่า commit**)
3. เปิด **Google Drive API** ให้โปรเจกต์

## 2. แชร์โฟลเดอร์ Drive กับ SA

แชร์โฟลเดอร์ **ICE MINT wedding 20dec2026** แต่ละใบให้ email ของ SA:

| albumKey (ใน `DRIVE_ALBUMS_JSON`) | โฟลเดอร์ | สิทธิ SA |
|-----------------------------------|----------|----------|
| `vdo-present` | VDO Present | Viewer |
| `vdo-wedding-day` | VDO Wedding day | Viewer |
| `prewedding` | Prewedding | Viewer |
| `wedding-day` | Wedding Day | Viewer |
| `guest-photos` | แชร์รูปความประทับใจ | **Editor** |
| `guest-videos` | วิดีโออวยพร | **Editor** |

**ปิด** “Anyone with the link” บนโฟลเดอร์เหล่านี้ — ให้เข้าได้เฉพาะเจ้าของ + SA

Folder ID ใส่ใน secret `DRIVE_ALBUMS_JSON` เท่านั้น (ดู [`functions/drive-albums.example.json`](../functions/drive-albums.example.json))

ตัวอย่าง JSON (แทนที่ YOUR_FOLDER_ID ด้วย ID จาก URL โฟลเดอร์ Drive — **อย่า commit ไฟล์ที่มี ID จริง**):

```json
{
  "vdo-present": "...",
  "vdo-wedding-day": "...",
  "prewedding": "...",
  "wedding-day": "...",
  "guest-photos": "...",
  "guest-videos": "..."
}
```

ตั้งค่า secrets บน Firebase (แนะนำ):

```powershell
firebase functions:secrets:set GOOGLE_SERVICE_ACCOUNT_JSON
firebase functions:secrets:set DRIVE_ALBUMS_JSON
firebase functions:secrets:set ALLOWED_ORIGINS
```

แล้วอ้าง secrets ใน `functions/src/index.ts` (หรือ inject ผ่าน `defineSecret` ใน Gen2)

## 3. Deploy Functions

```powershell
cd "D:\003_wedding plan\functions"
copy .env.example .env
# แก้ .env — GOOGLE_SERVICE_ACCOUNT_JSON (บรรทัดเดียว JSON), DRIVE_ALBUMS_JSON, ALLOWED_ORIGINS

npm install
npm run build
firebase login
firebase use YOUR_PROJECT_ID
firebase deploy --only functions
```

หลัง deploy คัดลอก URL ของ function `mediaApi` (เช่น `https://asia-southeast1-PROJECT.cloudfunctions.net/mediaApi`) ใส่ใน:

- Local: `.env` → `VITE_MEDIA_API_BASE=...`
- GitHub: Secret `VITE_MEDIA_API_BASE` (workflow deploy Pages)

## 4. ทดสอบ

```text
GET  {BASE}/media/list?album=wedding-day&pageSize=10&page=1
GET  {BASE}/media/file?fileId=...&disposition=inline
POST {BASE}/media/share  (multipart: type=photo|video, sourceLabel=..., file=...)
```

CORS อนุญาต `https://icemintwedding20dec26.com` และ `http://127.0.0.1:5173` (ตั้งใน `ALLOWED_ORIGINS`)

## 5. แชร์จากแขก — โฟลเดอร์ย่อย

แขกกรอก **ชื่อกล้อง / แหล่งที่มา** → API สร้างโฟลเดอร์ `{slug}-{YYYY-MM-DD}` ใต้ `guest-photos` หรือ `guest-videos` แล้วอัปโหลดไฟล์

## 6. ขีดจำกัด

- อัปโหลด: รูป ≤ 8 MB, วิดีโอ ≤ 80 MB (ตรง [`uploadConfig.ts`](../src/config/uploadConfig.ts))
- ไม่กัน screenshot — เป้าคือไม่เปิด Drive UI / ไม่ leak sharing link
