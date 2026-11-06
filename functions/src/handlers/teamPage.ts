import type { Request, Response } from 'express'
import { isTeamAlbum, TEAM_ALBUMS, TEAM_UPLOAD_TOKEN, teamTokenMatches } from '../teamAccess'

export function handleTeamPage(req: Request, res: Response): void {
  const album = String(req.params.album ?? '')
  const token = String(req.query.k ?? '')
  if (!isTeamAlbum(album) || !teamTokenMatches(token)) {
    res.status(404).type('text/plain').send('not_found')
    return
  }

  const meta = TEAM_ALBUMS[album]
  const title = meta.title
  const isVideo = meta.kind === 'video'
  const albumJson = JSON.stringify(album)
  const tokenJson = JSON.stringify(TEAM_UPLOAD_TOKEN)
  const titleJson = JSON.stringify(title)
  const noun = isVideo ? 'คลิป' : 'รูป'
  const accept = isVideo ? 'video/mp4,video/quicktime,video/webm' : 'image/jpeg,image/png,image/webp'
  const hint = isVideo
    ? 'เลือกไฟล์ MP4 แล้วกดส่ง คลิปจะขึ้นในหน้าวิดีโอของแขกทันที ไฟล์ละไม่เกิน 80 MB'
    : 'เลือกรูป JPG หรือ PNG แล้วกดส่ง รูปจะขึ้นในหน้าเว็บของแขกทันที อัปโหลดได้หลายรูปต่อครั้ง ไฟล์ละไม่เกิน 25 MB'

  res.type('html').send(`<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} — Ice &amp; Mint</title>
  <style>
    :root { color-scheme: light; }
    body {
      margin: 0; font-family: "Segoe UI", sans-serif; color: #2a4872;
      background: linear-gradient(#fffcf8, #f3ebe3);
    }
    main { max-width: 28rem; margin: 0 auto; padding: 1.5rem 1.15rem 3rem; }
    p { line-height: 1.6; }
    .eyebrow { letter-spacing: 0.18em; text-transform: uppercase; font-size: 0.75rem; color: #82a0c2; }
    h1 { font-weight: 600; font-size: 1.7rem; margin: 0.3rem 0 0.6rem; }
    button, label.pick {
      display: block; width: 100%; box-sizing: border-box; text-align: center;
      border-radius: 999px; padding: 0.9rem 1rem; font: inherit; font-size: 1rem;
    }
    label.pick { background: #2a4872; color: #fffcf8; }
    button { margin-top: 0.8rem; background: #fff; color: #2a4872; border: 1px solid #d7c9bd; }
    button:disabled { opacity: 0.55; }
    input { position: absolute; width: 1px; height: 1px; opacity: 0; }
    #status { min-height: 1.5rem; }
  </style>
</head>
<body>
  <main>
    <p class="eyebrow">Ice &amp; Mint</p>
    <h1 id="title"></h1>
    <p>${hint}</p>
    <form id="form">
      <input id="files" type="file" accept="${accept}" multiple />
      <label class="pick" for="files">เลือก${noun}จากเครื่อง</label>
      <p id="picked">ยังไม่ได้เลือก${noun}</p>
      <button id="send" type="submit" disabled>ส่ง${noun}ขึ้นเว็บ</button>
    </form>
    <p id="status" role="status"></p>
  </main>
  <script>
    const album = ${albumJson}
    const token = ${tokenJson}
    const title = ${titleJson}
    const noun = ${JSON.stringify(noun)}
    document.getElementById('title').textContent = title
    const input = document.getElementById('files')
    const picked = document.getElementById('picked')
    const send = document.getElementById('send')
    const status = document.getElementById('status')
    input.addEventListener('change', () => {
      const n = input.files.length
      picked.textContent = n ? 'เลือกแล้ว ' + n + ' ' + noun : 'ยังไม่ได้เลือก' + noun
      send.disabled = n === 0
      status.textContent = ''
    })
    document.getElementById('form').addEventListener('submit', async (event) => {
      event.preventDefault()
      const files = Array.from(input.files || [])
      if (!files.length) return
      send.disabled = true
      let done = 0
      for (const file of files) {
        status.textContent = 'กำลังส่ง ' + (done + 1) + '/' + files.length + ' …'
        const body = new FormData()
        body.append('album', album)
        body.append('token', token)
        body.append('file', file, file.name)
        const res = await fetch('../media/team', { method: 'POST', body })
        if (!res.ok) {
          let code = String(res.status)
          try { code = (await res.json()).error || code } catch (e) {}
          status.textContent = 'ส่งไม่สำเร็จที่ไฟล์ ' + (done + 1) + ' (' + code + ')'
          send.disabled = false
          return
        }
        done += 1
      }
      status.textContent = 'ส่งแล้ว ' + done + ' ' + noun + ' — แขกเห็นบนเว็บได้ทันที'
      input.value = ''
      picked.textContent = 'ยังไม่ได้เลือก' + noun
    })
  </script>
</body>
</html>`)
}
