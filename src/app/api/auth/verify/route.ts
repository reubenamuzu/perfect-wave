import { NextResponse } from 'next/server'
import { getAuthToken, verifyToken } from '@/lib/auth'

export async function GET() {
  const token = await getAuthToken()
  if (!token) return NextResponse.json({ valid: false }, { status: 401 })

  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ valid: false }, { status: 401 })

  return NextResponse.json({ valid: true, admin: payload })
}
