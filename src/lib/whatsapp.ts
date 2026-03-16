export interface OrderData {
  orderId: string
  orderType: 'bundle' | 'frame'
  paymentMethod: 'momo_before' | 'momo_request' | 'cash_on_delivery'
  customerName: string
  customerPhone: string
  price: number
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
  momoNumber?: string
}

export function buildWhatsAppURL(message: string): string {
  return `https://wa.me/233597473708?text=${encodeURIComponent(message)}`
}

// ── BUNDLE TEMPLATES ──

export function bundleMomoBefore(d: OrderData): string {
  return `Hello PerfectWave Services! 👋

I'd like to order a data bundle:

📦 *Bundle:* ${d.network} ${d.size} — GH¢${d.price}
📱 *Number to receive bundle:* ${d.bundlePhone}
💳 *Payment:* MoMo Before Delivery
📞 *Sending MoMo from:* ${d.momoNumber}
👤 *Name:* ${d.customerName}
📲 *Contact:* ${d.customerPhone}
🔖 *Order ID:* ${d.orderId}${d.note ? `\n📝 *Note:* ${d.note}` : ''}

I will send GH¢${d.price} to 0597473708 and share the screenshot here. Thank you!`
}

export function bundleMomoRequest(d: OrderData): string {
  return `Hello PerfectWave Services! 👋

I'd like to order a data bundle:

📦 *Bundle:* ${d.network} ${d.size} — GH¢${d.price}
📱 *Number to receive bundle:* ${d.bundlePhone}
💳 *Payment:* MoMo Request
📲 *Send MoMo request to:* ${d.customerPhone}
👤 *Name:* ${d.customerName}
🔖 *Order ID:* ${d.orderId}${d.note ? `\n📝 *Note:* ${d.note}` : ''}

Please send me a MoMo request of GH¢${d.price} to confirm. Thank you!`
}

// ── FRAME TEMPLATES ──

export function frameMomoBefore(d: OrderData): string {
  return `Hello PerfectWave Services! 👋

I'd like to order a picture frame:

🖼️ *Frame:* ${d.frameName}
📐 *Size:* ${d.frameSize}
💰 *Price:* GH¢${d.price}${d.imageUrl ? `\n📸 *My photo:* ${d.imageUrl}` : ''}
💳 *Payment:* MoMo Before Delivery
📞 *Sending MoMo from:* ${d.momoNumber}
🏠 *Delivery address:* ${d.deliveryAddress || 'To be confirmed'}
👤 *Name:* ${d.customerName}
📲 *Contact:* ${d.customerPhone}
🔖 *Order ID:* ${d.orderId}${d.note ? `\n📝 *Note:* ${d.note}` : ''}

I will send GH¢${d.price} to 0597473708 and share the screenshot. Thank you!`
}

export function frameMomoRequest(d: OrderData): string {
  return `Hello PerfectWave Services! 👋

I'd like to order a picture frame:

🖼️ *Frame:* ${d.frameName}
📐 *Size:* ${d.frameSize}
💰 *Price:* GH¢${d.price}${d.imageUrl ? `\n📸 *My photo:* ${d.imageUrl}` : ''}
💳 *Payment:* MoMo Request
📲 *Send MoMo request to:* ${d.customerPhone}
🏠 *Delivery address:* ${d.deliveryAddress || 'To be confirmed'}
👤 *Name:* ${d.customerName}
🔖 *Order ID:* ${d.orderId}${d.note ? `\n📝 *Note:* ${d.note}` : ''}

Please send me a MoMo request of GH¢${d.price} to confirm. Thank you!`
}

export function frameCashOnDelivery(d: OrderData): string {
  return `Hello PerfectWave Services! 👋

I'd like to order a picture frame:

🖼️ *Frame:* ${d.frameName}
📐 *Size:* ${d.frameSize}
💰 *Price:* GH¢${d.price}${d.imageUrl ? `\n📸 *My photo:* ${d.imageUrl}` : ''}
💳 *Payment:* Cash on Delivery
🏠 *Delivery address:* ${d.deliveryAddress}
👤 *Name:* ${d.customerName}
📲 *Contact:* ${d.customerPhone}
🔖 *Order ID:* ${d.orderId}${d.note ? `\n📝 *Note:* ${d.note}` : ''}

I will pay GH¢${d.price} cash on delivery. Thank you!`
}

// ── SELECTOR ──

export function buildWhatsAppMessage(d: OrderData): string {
  if (d.orderType === 'bundle' && d.paymentMethod === 'momo_before') return bundleMomoBefore(d)
  if (d.orderType === 'bundle' && d.paymentMethod === 'momo_request') return bundleMomoRequest(d)
  if (d.orderType === 'frame'  && d.paymentMethod === 'momo_before') return frameMomoBefore(d)
  if (d.orderType === 'frame'  && d.paymentMethod === 'momo_request') return frameMomoRequest(d)
  if (d.orderType === 'frame'  && d.paymentMethod === 'cash_on_delivery') return frameCashOnDelivery(d)
  return ''
}

// ── LEGACY HELPERS (still used in contact page) ──

export function generalInquiryMessage(name: string, subject: string, message: string): string {
  return `Hello! My name is *${name}*.\n\n📌 Subject: ${subject}\n\n${message}`
}
