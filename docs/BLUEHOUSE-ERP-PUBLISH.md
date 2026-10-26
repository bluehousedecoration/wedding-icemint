# Bluehouse ERP — publish ที่นั่งให้เว็บแขก (Ice & Mint)

เว็บแขกโหลด JSON จาก URL สาธารณะ (ไม่ login ERP) — อัปเดตเมื่อบันทึก seating ใน [Wedding → Seating](https://erp.bluehousedecoration.com/wedding/seating)

## URL ที่แนะนำ

```
https://erp.bluehousedecoration.com/wedding/seating/guest-seating.json
```

- API โดยตรง: `GET {NEXT_PUBLIC_API_URL}/public/wedding/guest-seating.json`
- Next.js proxy: `bluehouse-erp-frontend/src/app/wedding/seating/guest-seating.json/route.ts`

เว็บ wedding-icemint ตั้งค่า default ไว้ที่ [`siteContent.seatingLiveJsonUrl`](../src/config/siteContent.ts) (override ด้วย `VITE_SEATING_JSON_URL` ตอน build ได้)

## CORS

Response จาก API ต้องอนุญาต origin ของเว็บแขก เช่น `https://bluehousedecoration.github.io` และ `http://127.0.0.1:5173`

## JSON schema (v2 — ค้นชื่อ + ผัง interactive)

ดูตัวอย่าง [`public/guest-seating.example.json`](../public/guest-seating.example.json)

| ฟิลด์ | บังคับ | หมายเหตุ |
|--------|--------|----------|
| `updatedAt` | ใช่ | ISO datetime — ใช้ poll / cache bust |
| `source` | ไม่ | `"bluehouse"` |
| `layout` | ใช่ | จุดทางเข้า + แกน aisle + path ภาพผัง |
| `layout.entrance` | ใช่ | `{ x, y }` เปอร์เซ็นต์บนผัง |
| `layout.aisleX` | ใช่ | แกนกลางทางเดิน (%) |
| `tables[]` | ใช่ | ตำแหน่งโต๊ะจาก ERP (`pos_x/pos_y`) |
| `assignments[]` | ใช่ | ที่นั่งในโต๊ะ (read-only บนเว็บแขก) |
| `searchIndex[]` | ใช่ | ค้นชื่อบนซองเชิญ — **ไม่ใช้ QR แล้ว** |

**ห้าม** ใส่เบอร์โทร / notes ส่วนตัว — ไฟล์เปิดสาธารณะ

## เมื่อไหร่ publish ใหม่

ERP publish อัตโนมัติ (debounce ~1.5s) หลัง:

- จัดที่นั่ง / ย้ายโต๊ะ / แก้แขก
- บันทึกตำแหน่งโต๊ะ (`จัดตำแหน่งโต๊ะ`)
- บันทึกจุดทางเข้า (`ตั้งค่าเส้นทางเว็บแขก`)

แขกเปิด `/seat` — โหลดซ้ำทุก ~15 วินาที

## มาร์กตำแหน่งโต๊ะ (ERP)

1. แท็บ **ผังจัดโต๊ะ** → **จัดตำแหน่งโต๊ะ** → ลากวงโต๊ะ → **บันทึกตำแหน่ง**
2. ตั้ง **ทางเข้า X/Y** และ **แกนกลางทางเดิน** → **บันทึกเส้นทาง**
3. รัน migration ครั้งเดียว (ถ้ายังไม่มีคอลัมน์):

```powershell
cd D:\001_bluehouse-erp
node scripts/migrate-wedding-floor-layout.js
```

## ทดสอบก่อน production

1. `POST /wedding/publish-guest-seating` (login ERP) หรือแก้ seating ใน ERP
2. เปิด `https://erp.bluehousedecoration.com/wedding/seating/guest-seating.json`
3. Local dev เว็บแขก: `VITE_SEATING_LIVE=1 npm run dev` เพื่อบังคับใช้ ERP แทน `public/seating.json`

## Legacy

รูปแบบเก่า `{ guests: [...] }` ยังรองรับในเว็บแขก (แปลงเป็น snapshot ชั่วคราว) — export มือจาก `npm run seating:import`
