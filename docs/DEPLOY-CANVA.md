# Deploy และ QR บนการ์ด Canva

## GitHub Pages (แนะนำ)

1. Push โปรเจกต์ขึ้น GitHub
2. **Settings → Pages → Build and deployment → GitHub Actions**
3. Push ไป branch `main` — workflow [`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml) จะ build อัตโนมัติ
4. URL จะเป็น `https://<username>.github.io/<repo-name>/`

## Build มือ (ทดสอบ)

```bash
# Project site (repo ไม่ใช่ username.github.io)
set BASE_PATH=/ชื่อ-repo/
npm run build
npm run preview
```

## สร้างลิงก์ QR ต่อแขก

1. อัปเดต `data/guests.csv` จาก Bluehouse แล้ว `npm run guests:build`
2. Export ลิงก์:

```bash
set SITE_ORIGIN=https://username.github.io
set BASE_PATH=/ชื่อ-repo/
npm run qr:export
```

3. เปิด `data/guest-qr-links.csv` — คอลัมน์ `invite_url` ใส่ใน Canva (QR แยกต่อแถว)

## Checklist ก่อนพิมพ์การ์ด

- [ ] Deploy แล้ว URL เปิดได้บนมือถือ (4G/5G ไม่ใช่ Wi‑Fi dev)
- [ ] ทดสอบสแกน QR ตัวอย่าง `?g=ICE0284` → หน้าโต๊ะ + ชื่อ
- [ ] กำหนดการและแผนที่ถูกต้อง
- [ ] รหัส `id` ใน CSV ล็อกแล้ว — ย้ายโต๊ะแก้ใน CSV ได้โดยไม่เปลี่ยน QR

## ผังจาก Bluehouse

1. Export PNG จาก ERP → `public/floor-plan.png`
2. แก้ [`src/config/floorPlan.ts`](../src/config/floorPlan.ts): `imageUrl`, `tableMarkers`
