# โหมดอัปโหลดรูป + อัดวิดีโออวยพร (แขก)

หน้า **`/share`** — แขกอัปโหลดรูปและอัดคลิปบนมือถือผ่านเบราว์เซอร์ (ต้อง **HTTPS** บน production)

## 1. สร้าง Firebase (ฟรี tier)

1. [Firebase Console](https://console.firebase.google.com/) → สร้างโปรเจกต์
2. **Build → Storage** → เริ่มใช้ (เลือก region ใกล้ไทย เช่น asia-southeast1)
3. **Build → Authentication** → Sign-in method → เปิด **Anonymous**
4. **Project settings → Your apps → Web** → คัดลอก config

## 2. ใส่ค่าในโปรเจกต์

```powershell
copy .env.example .env
# แก้ .env ให้ครบทุก VITE_FIREBASE_*
npm run dev
```

Deploy (GitHub Pages): Repo **Settings → Secrets and variables → Actions** → สร้าง secret ชื่อเดียวกับตัวแปรด้านล่าง (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, …) แล้ว push `main` — workflow จะ inject ตอน build

Local: ใส่ใน `.env` (อย่า commit)

## 3. Storage Rules (แนะนำ)

Firebase Console → Storage → Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /ice-mint-wedding/{folder}/{fileName} {
      allow write: if request.auth != null
                   && (folder == 'photos' || folder == 'videos')
                   && request.resource.size < 85 * 1024 * 1024;
      allow read: if false;
    }
  }
}
```

แขก login แบบ anonymous อัตโนมัติตอนอัปโหลด — บ่าวสาวดูไฟล์ใน Firebase Console → Storage

## 4. ขีดจำกัด (แก้ได้ใน `src/config/uploadConfig.ts`)

| ประเภท | ค่าเริ่มต้น |
|--------|-------------|
| รูป | 8 MB |
| วิดีโอ | 90 วินาที, 80 MB |

## 5. มือถือ

- ใช้ Chrome / Safari ล่าสุด
- อนุญาตกล้อง + ไมโครโฟน
- iOS ต้องเปิดผ่าน **HTTPS** (GitHub Pages ใช้ได้)

## ลิงก์สำรอง

ถ้ายังไม่ตั้ง Firebase ใส่ Google Form ใน `siteContent.guestShare.photoFormUrl` / `videoMessageFormUrl`
