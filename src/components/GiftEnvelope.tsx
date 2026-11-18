import { publicAssetUrl } from '../lib/assetUrl'
import { siteContent } from '../config/siteContent'

export function GiftScrollButton() {
  return (
    <button
      type="button"
      className="action gift-jump"
      onClick={() => {
        document.getElementById('gift-envelope')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }}
    >
      ใส่ซองอวยพรให้บ่าวสาว
    </button>
  )
}

export function GiftEnvelope() {
  const gift = siteContent.giftEnvelope
  const qrUrl = publicAssetUrl(gift.qrImageUrl)

  return (
    <section className="gift-card" id="gift-envelope" aria-labelledby="gift-envelope-title">
      <p className="eyebrow">PromptPay</p>
      <h2 id="gift-envelope-title">{gift.title}</h2>
      <p className="gift-lead">{gift.lead}</p>
      <img
        className="gift-qr"
        src={qrUrl}
        alt={`QR PromptPay ใส่ซอง ${gift.accountName} บัญชี ${gift.accountNumber}`}
        width={720}
        height={1080}
      />
      <a className="gift-save" href={qrUrl} download="ice-mint-gift-qr.jpg">
        {gift.saveLabel}
      </a>
    </section>
  )
}
