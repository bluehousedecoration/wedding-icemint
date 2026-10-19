# Sync ผังและรายชื่อจาก Bluehouse ERP

หน้า [Wedding → Seating](https://erp.bluehousedecoration.com/wedding/seating) เป็นที่จัดโต๊ะจริง (40 โต๊ะ, VIP 21 & 26)

เว็บ QR **ดึง API จาก ERP โดยตรงไม่ได้** (ต้อง login) — sync ผ่านไฟล์ export แล้วอัปเดต `seating.json`

## ขั้นตอน

1. จัดโต๊ะใน Bluehouse ให้ครบ
2. Export รายชื่อ + หมายเลขโต๊ะ (JSON หรือ CSV) จาก ERP  
   - ถ้ายังไม่มีปุ่ม export: ส่งออกจาก Google Sheet ที่ sync กับ Bluehouse หรือ copy เป็น CSV คอลัมน์ `id,label,table,zone,seats`
3. **`id` ต้องตรงกับรหัสบน QR การ์ด** (ไม่ใช่เลขโต๊ะ)
4. รัน:

```powershell
node scripts/import-bluehouse-seating.mjs path\to\bluehouse-export.json
npm run build
```

หรือ dev: วางผลลัพธ์ใน `public/seating.json` แล้วรีเฟรช — แขกโหลดไฟล์นี้โดยไม่ rebuild bundle ก็ได้

## ผังบนเว็บ

- ใช้ **SVG 40 โต๊ะ** ตาม layout Bluehouse ([`src/config/hallLayout.ts`](../src/config/hallLayout.ts))
- แขกสแกน `?g=...` → ไฮไลต์โต๊ะบนผัง + แสดง Table / VIP
- ถ้ามี PNG export จาก ERP: ตั้ง `imageUrl` ใน [`floorPlan.ts`](../src/config/floorPlan.ts) + `tableMarkers`

## ย้ายโต๊ะก่อนงาน

แก้โต๊ะใน Bluehouse → export ใหม่ → import อีกครั้ง — **QR เดิมไม่เปลี่ยน**
