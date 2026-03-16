import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { jwtVerify } from 'jose'
import { connectDB } from '@/lib/db'
import Admin from '@/models/Admin'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'change_me_super_secret_key_32chars'
)

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { payload } = await jwtVerify(token, JWT_SECRET)
    const adminId = payload.adminId as string

    const { currentPassword, newPassword } = await req.json()
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Both passwords required' }, { status: 400 })
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
    }

    await connectDB()
    const admin = await Admin.findById(adminId)
    if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 })

    const valid = await bcrypt.compare(currentPassword, admin.passwordHash)
    if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })

    admin.passwordHash = await bcrypt.hash(newPassword, 12)
    await admin.save()

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
}
