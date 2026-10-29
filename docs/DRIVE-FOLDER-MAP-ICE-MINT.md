# แมปโฟลเดอร์ Drive — Ice & Mint (20 Dec 2026)

อัปเดตใน `secrets/drive-albums.json` แล้ว — หลัง deploy ใช้ `npm run media:deploy`

| โฟลเดอร์ | albumKey | สิทธิ SA |
|----------|----------|----------|
| แชร์รูปความประทับใจ (จากแขก) | `guest-photos` | **Editor** |
| วิดีโออวยพร | `guest-videos` | **Editor** |
| Pre-wedding | `prewedding` | Viewer |
| VDO Present | `vdo-present` | Viewer |
| VDO Wedding day | `vdo-wedding-day` | Viewer |
| Wedding Day | `wedding-day` | Viewer |
| Wedding Backdrop ทางเข้า | `wedding-backdrop` | Viewer |

**Service account (แชร์ใน Drive):**  
`ice-mint-media@ice-mint-wedding-513105.iam.gserviceaccount.com`

**วิธีเร็ว:** แชร์โฟลเดอร์หลัก `ICE MINT wedding 20dec2026` ให้ SA สิทธิ **ผู้แก้ไข (Editor)** ครั้งเดียว — ครอบคลุมทุกโฟลเดอร์ย่อย

ทดสอบ: `npm run media:verify` (upload ต้องได้ 200)
