import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import Admin from '@/models/Admin'
import { signToken, clearAuthCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    await connectDB()
    const admin = await Admin.findOne({ email: email.toLowerCase() })
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, admin.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signToken({ adminId: admin._id.toString(), email: admin.email })

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return response
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE() {
  await clearAuthCookie()
  return NextResponse.json({ success: true })
}
