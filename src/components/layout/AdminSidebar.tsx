'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Frame,
  GalleryHorizontal,
  Star,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import PerfectWaveLogo from '@/components/shared/PerfectWaveLogo'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/dashboard/bundles', label: 'Data Bundles', icon: Package },
  { href: '/dashboard/frames', label: 'Picture Frames', icon: Frame },
  { href: '/dashboard/gallery', label: 'Gallery', icon: GalleryHorizontal },
  { href: '/dashboard/reviews', label: 'Reviews', icon: Star },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/login', { method: 'DELETE' })
    toast.success('Logged out')
    router.push('/login')
  }

  return (
    <aside
      className="w-60 min-h-screen flex flex-col bg-white"
      style={{ borderRight: '1px solid #C8DFF0' }}
    >
      {/* Logo */}
      <div className="px-5 py-4" style={{ borderBottom: '1px solid #C8DFF0' }}>
        <Link href="/dashboard" aria-label="Admin dashboard">
          <PerfectWaveLogo size="sm" variant="dark" />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'text-[#1B6CA8] font-medium'
                  : 'text-[#5A7A99] hover:text-[#1B6CA8] hover:bg-[#F4F8FC] font-normal'
              )}
              style={
                isActive
                  ? {
                      backgroundColor: '#EAF3FB',
                      borderLeft: '3px solid #1B6CA8',
                      fontFamily: 'Outfit, sans-serif',
                    }
                  : { fontFamily: 'Outfit, sans-serif' }
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer actions */}
      <div className="p-3 space-y-1" style={{ borderTop: '1px solid #C8DFF0' }}>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#5A7A99] hover:text-[#1B6CA8] hover:bg-[#EAF3FB] transition-colors w-full"
          style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 400 }}
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#5A7A99] hover:text-red-500 hover:bg-red-50 transition-colors w-full"
          style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 400 }}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  )
}
