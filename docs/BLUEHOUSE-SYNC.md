# Sync ผังและรายชื่อจาก Bluehouse ERP

หน้า [Wedding → Seating](https://erp.bluehousedecoration.com/wedding/seating) เป็นที่จัดโต๊ะจริง (40 โต๊ะ, VIP 21 & 26)

## โหมดอัตโนมัติ (แนะนำ)

เมื่อ ERP publish JSON แล้ว เว็บแขกโหลดจาก:

`https://erp.bluehousedecoration.com/wedding/seating/guest-seating.json`

(ตั้งใน [`siteContent.seatingLiveJsonUrl`](../src/config/siteContent.ts) หรือ override ด้วย `VITE_SEATING_JSON_URL`)

รายละเอียดฝั่ง ERP: **[BLUEHOUSE-ERP-PUBLISH.md](./BLUEHOUSE-ERP-PUBLISH.md)**

ลำดับโหลดในเว็บ: **ERP URL → `seating.json` บน GitHub Pages → `guests.json` ใน bundle**

แก้โต๊ะใน Bluehouse → publish JSON → แขก **รีเฟรช** `/seat?g=...` — **QR ไม่เปลี่ยน**

## โหมด export มือ (สำรอง)

1. Export รายชื่อ + โต๊ะ (JSON/CSV) — คอลัมน์ `id,label,table,zone,seats,tableName,seatLabel`
2. **`id` = รหัส QR บนการ์ด**
3. รัน:

```powershell
node scripts/import-bluehouse-seating.mjs path\to\bluehouse-export.json
npm run build
```

ผลลัพธ์: `src/data/guests.json` + `public/seating.json`

## ผังบนเว็บ

- SVG 40 โต๊ะ [`hallLayout.ts`](../src/config/hallLayout.ts)
- PNG จาก ERP: [`floorPlan.ts`](../src/config/floorPlan.ts)

## ตัวอย่าง JSON

[`public/guest-seating.example.json`](../public/guest-seating.example.json)
