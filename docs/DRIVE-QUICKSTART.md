# Drive Media — เริ่มเร็ว (คุณวาง .env แล้วรันคำสั่ง)

## 1. ไฟล์ที่ต้องมี

| ไฟล์ | ที่มา |
|------|--------|
| `secrets/google-service-account.json` | GCP → Service Account → Create key JSON |
| `secrets/drive-albums.json` | คัดลอกจาก `secrets/drive-albums.example.json` ใส่ Folder ID |
| `functions/.env` | คัดลอกจาก `functions/.env.example` |

แชร์โฟลเดอร์ Drive ให้ email ใน SA (ดู [DRIVE-SETUP-TH.md](./DRIVE-SETUP-TH.md))

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

Production: GitHub → Secrets → `VITE_MEDIA_API_BASE` → push `main`

## 5. ปิดรูป demo

เมื่อ list API ได้ไฟล์จริง ตั้งใน `siteContent.ts`:

`mediaDemoUntilDriveReady: false`

(หรือปล่อย `true` ไว้ — ถ้ามี `VITE_MEDIA_API_BASE` แล้ว demo ปิดเอง)
