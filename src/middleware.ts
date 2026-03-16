import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'change_me_super_secret_key_32chars'
)

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return false
  try {
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const authed = await isAuthenticated(req)

  // Redirect logged-in admin away from login page
  if (pathname === '/login' && authed) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Protect all /dashboard routes
  if (pathname.startsWith('/dashboard') && !authed) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
