export function buildWhatsAppURL(message: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${number}?text=${encoded}`
}

export function bundleOrderMessage(network: string, size: string, price: number): string {
  return `Hello! I would like to order:\n\n📦 *${network} ${size} Data Bundle*\n💰 Price: GH¢${price.toFixed(2)}\n\nPlease confirm availability. Thank you!`
}

export function frameOrderMessage(
  frameName: string,
  size: string,
  price: number,
  imageUrl?: string
): string {
  return `Hello! I would like to order:\n\n🖼️ *${frameName} Picture Frame*\n📐 Size: ${size}\n💰 Price: GH¢${price.toFixed(2)}${imageUrl ? `\n📸 My photo: ${imageUrl}` : ''}\n\nPlease confirm. Thank you!`
}

export function generalInquiryMessage(name: string, subject: string, message: string): string {
  return `Hello! My name is *${name}*.\n\n📌 Subject: ${subject}\n\n${message}`
}
