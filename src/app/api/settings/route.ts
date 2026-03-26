import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { connectDB } from '@/lib/db'
import Settings from '@/models/Settings'
import { getSettings } from '@/lib/getSettings'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'change_me_super_secret_key_32chars'
)

export async function GET() {
  try {
    const settings = await getSettings()
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json(
      { momoNumber: '0558373809', whatsappNumber: '233597473708' }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    await jwtVerify(token, JWT_SECRET)

    const { momoNumber, whatsappNumber } = await req.json()
    if (!momoNumber || !whatsappNumber) {
      return NextResponse.json({ error: 'Both numbers are required' }, { status: 400 })
    }

    await connectDB()
    const settings = await Settings.findOneAndUpdate(
      {},
      { momoNumber, whatsappNumber },
      { upsert: true, new: true }
    )

    return NextResponse.json({ momoNumber: settings.momoNumber, whatsappNumber: settings.whatsappNumber })
  } catch {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
}
