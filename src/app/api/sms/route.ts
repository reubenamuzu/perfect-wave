import { NextRequest, NextResponse } from 'next/server'
import { sendSMS } from '@/lib/arkesel'

export async function POST(req: NextRequest) {
  try {
    const { phone, message } = await req.json()

    if (!phone || !message) {
      return NextResponse.json({ error: 'phone and message required' }, { status: 400 })
    }

    const success = await sendSMS(phone, message)
    return NextResponse.json({ success })
  } catch (err) {
    console.error('SMS route error:', err)
    return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 })
  }
}
