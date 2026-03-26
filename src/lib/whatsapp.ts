export interface OrderData {
  orderId: string
  orderType: 'bundle' | 'frame'
  paymentMethod: 'momo_before' | 'cash_on_delivery'
  customerName: string
  customerPhone: string
  price: number | null
  note?: string
  // Bundle
  network?: string
  size?: string
  bundlePhone?: string
  // Frame
  frameName?: string
  frameSize?: string
  imageUrl?: string
  deliveryAddress?: string
  momoAccountName?: string
  // Dynamic settings
  momoPaymentNumber?: string
}

export function buildWhatsAppURL(message: string, whatsappNumber = '233597473708'): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
}

function displayPrice(price: number | null): string {
  return price !== null ? `GH¢${price}` : 'Call for price'
}

// ── BUNDLE TEMPLATES ──

export function bundleMomoBefore(d: OrderData): string {
  return `Hello PerfectWave Enterprise! 👋

I'd like to order a data bundle:

📦 *Bundle:* ${d.network} ${d.size} — ${displayPrice(d.price)}
📱 *Number to receive bundle:* ${d.bundlePhone}
💳 *Payment:* MoMo Before Delivery${d.momoAccountName ? `\n👤 *MoMo Account Name:* ${d.momoAccountName}` : ''}
👤 *Name:* ${d.customerName}
📲 *Contact:* ${d.customerPhone}
🔖 *Order ID:* ${d.orderId}${d.note ? `\n📝 *Note:* ${d.note}` : ''}

I will send ${displayPrice(d.price)} to ${d.momoPaymentNumber ?? '0558373809'} and share the screenshot here. Thank you!`
}

// ── FRAME TEMPLATES ──

export function frameMomoBefore(d: OrderData): string {
  return `Hello PerfectWave Enterprise! 👋

I'd like to order a picture frame:

🖼️ *Frame:* ${d.frameName}
📐 *Size:* ${d.frameSize}
💰 *Price:* ${displayPrice(d.price)}${d.imageUrl ? `\n📸 *My photo:* ${d.imageUrl}` : ''}
💳 *Payment:* MoMo Before Delivery
🏠 *Delivery address:* ${d.deliveryAddress || 'To be confirmed'}
👤 *Name:* ${d.customerName}
📲 *Contact:* ${d.customerPhone}
🔖 *Order ID:* ${d.orderId}${d.note ? `\n📝 *Note:* ${d.note}` : ''}

I will send ${displayPrice(d.price)} to ${d.momoPaymentNumber ?? '0558373809'} and share the screenshot. Thank you!`
}

export function frameCashOnDelivery(d: OrderData): string {
  return `Hello PerfectWave Enterprise! 👋

I'd like to order a picture frame:

🖼️ *Frame:* ${d.frameName}
📐 *Size:* ${d.frameSize}
💰 *Price:* ${displayPrice(d.price)}${d.imageUrl ? `\n📸 *My photo:* ${d.imageUrl}` : ''}
💳 *Payment:* Cash on Delivery
🏠 *Delivery address:* ${d.deliveryAddress}
👤 *Name:* ${d.customerName}
📲 *Contact:* ${d.customerPhone}
🔖 *Order ID:* ${d.orderId}${d.note ? `\n📝 *Note:* ${d.note}` : ''}

I will pay ${displayPrice(d.price)} cash on delivery. Thank you!`
}

// ── SELECTOR ──

export function buildWhatsAppMessage(d: OrderData): string {
  if (d.orderType === 'bundle' && d.paymentMethod === 'momo_before') return bundleMomoBefore(d)
  if (d.orderType === 'frame'  && d.paymentMethod === 'momo_before') return frameMomoBefore(d)
  if (d.orderType === 'frame'  && d.paymentMethod === 'cash_on_delivery') return frameCashOnDelivery(d)
  return ''
}

// ── LEGACY HELPERS (still used in contact page) ──

export function generalInquiryMessage(name: string, subject: string, message: string): string {
  return `Hello! My name is *${name}*.\n\n📌 Subject: ${subject}\n\n${message}`
}
