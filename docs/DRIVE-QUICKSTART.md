# Drive Media — เริ่มเร็ว (คุณวาง .env แล้วรันคำสั่ง)

## 1. ไฟล์ที่ต้องมี

| ไฟล์ | ที่มา |
|------|--------|
| `secrets/google-service-account.json` | GCP → Service Account → Create key JSON |
| `secrets/drive-albums.json` | คัดลอกจาก `secrets/drive-albums.example.json` ใส่ Folder ID |
| `functions/.env` | คัดลอกจาก `functions/.env.example` |

แชร์โฟลเดอร์ Drive ให้ **Editor** กับ service account นี้ (ไม่งั้นอัปโหลด `/share` จะ error `upload_failed`):

`ice-mint-media@ice-mint-wedding-513105.iam.gserviceaccount.com`

โฟลเดอร์ทดสอบ/แชร์รูป (ID ใน `secrets/drive-albums.json`): `1p-F61PaXde6WWijrwgvhZ2pC4je_wtMy`

รายละเอียด: [DRIVE-SETUP-TH.md](./DRIVE-SETUP-TH.md)

## 2. `functions/.env` ตัวอย่าง

```env
FIREBASE_PROJECT_ID=your-firebase-project-id
GOOGLE_SERVICE_ACCOUNT_JSON_FILE=../secrets/google-service-account.json
DRIVE_ALBUMS_JSON_FILE=../secrets/drive-albums.json
```

## 3. Deploy API

```powershell
cd "D:\003_wedding plan"
npx firebase-tools login
npm run media:deploy
```

## 4. ฝั่งเว็บ — root `.env`

วางบรรทัดที่ script พิมพ์หลัง deploy:

```env
VITE_MEDIA_API_BASE=https://asia-southeast1-PROJECT.cloudfunctions.net/mediaApi
```

```powershell
npm run media:verify
npm run dev
```

Production: push `main` แล้ว Pages build เอง (มี URL Media API ในโค้ดแล้ว) — ตั้ง GitHub Secret `VITE_MEDIA_API_BASE` ได้ถ้าต้องการเปลี่ยน URL

## 5. ปิดรูป demo

เมื่อ list API ได้ไฟล์จริง ตั้งใน `siteContent.ts`:

`mediaDemoUntilDriveReady: false`

(หรือปล่อย `true` ไว้ — ถ้ามี `VITE_MEDIA_API_BASE` แล้ว demo ปิดเอง)
