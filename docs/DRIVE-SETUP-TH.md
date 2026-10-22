# ตั้งค่า Google Drive สำหรับรูป / VDO / แชร์แขก

แขกดูรูปที่ `/photos` และ VDO ที่ `/video` ผ่าน **Media API** — ไม่เห็นลิงก์ `drive.google.com`  
**ทีมถ่าย** อัปโหลดแยก: เปิดลิงก์ Drive ตรงที่ `/team/upload` (ไม่ผ่าน API)

---

## ขั้นที่ 1 — โฟลเดอร์บน Google Drive

1. ใน Drive สร้างโฟลเดอร์หลัก (เช่น `ICE MINT wedding 20dec2026`)
2. สร้างโฟลเดอร์ย่อย (หรือ **ทดสอบก่อน**: ใช้โฟลเดอร์เดียวใส่รูป/VDO ตัวอย่างไว้ก่อน)
3. คัดลอก **Folder ID** จาก URL  
   `https://drive.google.com/drive/folders/XXXXXXXX` → `XXXXXXXX`

| albumKey | ใช้กับหน้าเว็บ | สิทธิที่ SA ต้องได้ |
|----------|----------------|-------------------|
| `prewedding` | รูป Pre-Wedding | Viewer |
| `wedding-day` | รูป Wedding Day | Viewer |
| `vdo-present` | VDO Present | Viewer |
| `vdo-wedding-day` | VDO วันงาน | Viewer |
| `guest-photos` | แชร์รูปจากแขก | **Editor** |
| `guest-videos` | วิดีโออวยพรแขก | **Editor** |

**ทดสอบชั่วคราว (เนื้อหาเดียว):** ใส่ Folder ID **เดียวกัน** ทุก key ใน JSON ด้านล่าง — ทุกอัลบั้มจะโชว์ไฟล์ชุดเดียวกัน

---

## ขั้นที่ 2 — Service Account (Google Cloud)

1. [Firebase Console](https://console.firebase.google.com/) → เลือกโปรเจกต์ (หรือสร้างใหม่)
2. [Google Cloud Console](https://console.cloud.google.com/) โปรเจกต์เดียวกัน  
   **APIs & Services → Enable APIs** → เปิด **Google Drive API**
3. **IAM → Service Accounts → Create**  
   - สร้าง key แบบ **JSON** ดาวน์โหลดเก็บปลอดภัย (**ห้าม commit**)
4. จด email ของ SA (เช่น `xxx@yyy.iam.gserviceaccount.com`)

---

## ขั้นที่ 3 — แชร์โฟลเดอร์ให้ SA

แต่ละโฟลเดอร์ (หรือโฟลเดอร์เดียวตอนทดสอบ):

1. คลิกขวา → **Share**
2. ใส่ email ของ Service Account → สิทธิ **Viewer** (โฟลเดอร์แชร์แขกใช้ **Editor**)
3. **ปิด** “Anyone with the link” — ให้เข้าได้แค่เจ้าของ + SA

---

## ขั้นที่ 4 — JSON แมป albumKey → Folder ID

สร้างไฟล์ (อย่า commit ID จริงถ้า repo public):

```json
{
  "vdo-present": "FOLDER_ID",
  "vdo-wedding-day": "FOLDER_ID",
  "prewedding": "FOLDER_ID",
  "wedding-day": "FOLDER_ID",
  "guest-photos": "FOLDER_ID",
  "guest-videos": "FOLDER_ID"
}
```

ตัวอย่างโฟลเดอร์เดียว: [`functions/drive-albums.one-folder.example.json`](../functions/drive-albums.one-folder.example.json)

---

## ขั้นที่ 5 — Firebase Functions (secrets + deploy)

```powershell
cd "D:\003_wedding plan\functions"
npm install
npm run build

firebase login
firebase use YOUR_PROJECT_ID

firebase functions:secrets:set GOOGLE_SERVICE_ACCOUNT_JSON
# วาง JSON ทั้งก้อน (บรรทัดเดียว) แล้ว Enter

firebase functions:secrets:set DRIVE_ALBUMS_JSON
# วาง JSON แมปโฟลเดอร์

firebase functions:secrets:set ALLOWED_ORIGINS
# ตัวอย่าง: https://icemintwedding20dec26.com,http://127.0.0.1:5173

firebase deploy --only functions:mediaApi
```

คัดลอก URL ที่ได้ เช่น  
`https://asia-southeast1-PROJECT.cloudfunctions.net/mediaApi`

---

## ขั้นที่ 6 — ฝั่งเว็บ (Vite)

**Local** — สร้าง `.env` จาก `.env.example`:

```env
VITE_MEDIA_API_BASE=https://asia-southeast1-PROJECT.cloudfunctions.net/mediaApi
```

**Production** — GitHub → Settings → Secrets → `VITE_MEDIA_API_BASE` (ค่าเดียวกัน) แล้ว push ให้ Pages build ใหม่

---

## ขั้นที่ 7 — ปิดโหมดตัวอย่างบนเว็บ

ใน [`siteContent.ts`](../src/config/siteContent.ts) ตั้ง:

```ts
mediaDemoUntilDriveReady: false,
```

เมื่อ API ทำงานและโฟลเดอร์มีไฟล์แล้ว

---

## ทีมถ่าย (ลิงก์ Drive ตรง)

ไม่ใช้ Media API — ใส่ลิงก์โฟลเดอร์ใน `siteContent.photographer.uploadFolderUrl`  
แชร์ลิงก์ `/team/upload` เฉพาะช่างภาพ (ไม่ใส่ในเมนูแขก)

---

## ทดสอบ API

```text
GET {BASE}/media/list?album=prewedding&pageSize=10&page=1
```

รายละเอียดเพิ่ม: [DRIVE-MEDIA-API.md](./DRIVE-MEDIA-API.md)
