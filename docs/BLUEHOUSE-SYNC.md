# Sync ผังและรายชื่อจาก Bluehouse ERP

หน้า [Wedding → Seating](https://erp.bluehousedecoration.com/wedding/seating) เป็นที่จัดโต๊ะจริง

## โหมดอัตโนมัติ (แนะนำ)

เมื่อ ERP publish JSON แล้ว เว็บแขกโหลดจาก:

`https://erp.bluehousedecoration.com/wedding/seating/guest-seating.json`

รายละเอียดฝั่ง ERP: **[BLUEHOUSE-ERP-PUBLISH.md](./BLUEHOUSE-ERP-PUBLISH.md)**

ลำดับโหลดในเว็บ (production): **ERP URL → `public/seating.json` → แปลงจาก bundle**

- Dev ปกติ: `public/seating.json` ก่อน ERP (ไม่ต้อง CORS)
- Dev ทดสอบ live: `VITE_SEATING_LIVE=1 npm run dev`

แขกค้นหา **ชื่อบนซองเชิญ** จาก `searchIndex` — ไม่ใช้ QR เป็นหลัก

## มาร์กโต๊ะ + เส้นทาง

ทำใน **ERP** [`/wedding/seating`](https://erp.bluehousedecoration.com/wedding/seating) เท่านั้น:

- แท็บ **หน้าแขก** — preview ตรงกับเว็บ `/seat` (JSON จาก publish)
- **จัดตำแหน่งโต๊ะ** + **ตั้งค่าเส้นทางเว็บแขก** → บันทึกแล้ว publish `guest-seating.json`

รูปผัง AVA: `public/floor-plan-ava.png` (786×1217) · ERP: `/wedding/floor-plan-ava.png`

## โหมด export มือ (สำรอง)

```powershell
node scripts/import-bluehouse-seating.mjs path\to\bluehouse-export.json
```

ผลลัพธ์: `src/data/guests.json` + `public/seating.json` (รูปแบบ legacy — เว็บแขกแปลงให้อัตโนมัติ)

## ผังบนเว็บแขก

- ตำแหน่งโต๊ะจาก JSON (`tables[].posX/posY`)
- กดโต๊ะ → ดูที่นั่งในโต๊ะ (read-only)
- เส้นแดงจาก `layout.entrance` → โต๊ะที่เลือก

## ตัวอย่าง JSON

[`public/guest-seating.example.json`](../public/guest-seating.example.json)
