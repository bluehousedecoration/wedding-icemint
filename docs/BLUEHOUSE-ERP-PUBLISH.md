# Bluehouse ERP — publish ที่นั่งให้เว็บแขก (Ice & Mint)

เว็บแขกโหลด JSON จาก URL สาธารณะ (ไม่ login ERP) — อัปเดตเมื่อบันทึก seating ใน [Wedding → Seating](https://erp.bluehousedecoration.com/wedding/seating)

## URL ที่แนะนำ

```
https://erp.bluehousedecoration.com/wedding/seating/guest-seating.json
```

เว็บ wedding-icemint ตั้งค่า default ไว้ที่ [`siteContent.seatingLiveJsonUrl`](../src/config/siteContent.ts) (override ด้วย `VITE_SEATING_JSON_URL` ตอน build ได้)

## CORS (บังคับ)

Response ต้องมี header ให้ GitHub Pages เรียกจาก browser:

```
Access-Control-Allow-Origin: https://bluehousedecoration.github.io
Access-Control-Allow-Methods: GET
```

Dev local: เพิ่ม `http://127.0.0.1:5173` หรือใช้ `*` ชั่วคราว (ไม่แนะนำ production)

## JSON schema

ดูตัวอย่าง [`public/guest-seating.example.json`](../public/guest-seating.example.json)

| ฟิลด์ | บังคับ | หมายเหตุ |
|--------|--------|----------|
| `updatedAt` | ใช่ | ISO date `YYYY-MM-DD` — ใช้ cache bust |
| `source` | ไม่ | `"bluehouse"` |
| `guests[]` | ใช่ | อย่างน้อย 1 แถว |
| `guests[].id` | ใช่ | รหัส QR บนการ์ด (`ICE0284`) — **ห้ามเปลี่ยน** |
| `guests[].label` | ใช่ | ชื่อแสดงบนเว็บ |
| `guests[].table` | ใช่ | 1–40 |
| `guests[].zone` | ใช่ | เช่น ฝ่ายชาย / ฝ่ายหญิง |
| `guests[].seats` | ใช่ | จำนวนที่นั่งใน QR |
| `guests[].tableName` | ไม่ | ชื่อโต๊ะใน ERP |
| `guests[].seatLabel` | ไม่ | เช่น `โต๊ะ21-ที่นั่ง3` |

**อย่าใส่** เบอร์โทร ที่อยู่ ข้อมูลส่วนตัว — ไฟล์เปิดสาธารณะ

## เมื่อไหร่ generate ใหม่

- ลากแขกไปโต๊ะ / ย้ายโต๊ะ / บันทึกชื่อโต๊ะ
- หลัง publish แขก **รีเฟรช** `/seat?g=...` จะเห็นโต๊ะใหม่ (QR เดิม)

## QR code ใน ERP

แต่ละแขกหรือกลุ่มครอบครัวต้องมี **`guestCode` / `id`** คงที่ ตรงกับ CSV `npm run qr:export` — ไม่ใช่เลขโต๊ะ

## ทดสอบก่อนเชื่อม ERP

1. วาง JSON ชั่วคราวที่ URL ด้านบน หรือ
2. Export มือ → `npm run seating:import export.json` → push `public/seating.json`

## Pseudo-code (ฝั่ง ERP)

```text
onSeatingSaved():
  rows = map guests to { id, label, table, zone, seats, tableName, seatLabel }
  payload = { updatedAt: today, source: "bluehouse", guests: rows }
  writeFile("guest-seating.json", JSON.stringify(payload))
  // หรือ upload ไป object storage + CDN
```
