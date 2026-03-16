const ARKESEL_API_KEY = process.env.ARKESEL_API_KEY!
const SENDER_ID = process.env.ARKESEL_SENDER_ID ?? 'PerfectWave'

export async function sendSMS(phone: string, message: string): Promise<boolean> {
  try {
    const params = new URLSearchParams({
      action: 'send-sms',
      api_key: ARKESEL_API_KEY,
      to: phone,
      from: SENDER_ID,
      sms: message,
    })

    const res = await fetch(`https://sms.arkesel.com/sms/api?${params.toString()}`, {
      method: 'GET',
    })

    const data = await res.json()
    return data.code === 'ok'
  } catch (err) {
    console.error('SMS send failed:', err)
    return false
  }
}

export const smsTemplates = {
  processing: (name: string, orderId: string) =>
    `Hi ${name}, your order ${orderId} is being processed. We'll notify you when ready. - ${SENDER_ID}`,
  ready: (name: string, orderId: string) =>
    `Hi ${name}, your order ${orderId} is ready! We'll deliver soon. - ${SENDER_ID}`,
  delivered: (name: string, orderId: string) =>
    `Hi ${name}, your order ${orderId} has been delivered. Thank you! - ${SENDER_ID}`,
  cancelled: (name: string, orderId: string) =>
    `Hi ${name}, your order ${orderId} was cancelled. Contact us for help. - ${SENDER_ID}`,
}
