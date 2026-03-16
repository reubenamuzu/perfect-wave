'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Image,
  Star,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import PerfectWaveLogo from '@/components/shared/PerfectWaveLogo'

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/dashboard/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/dashboard/bundles', label: 'Data Bundles', icon: Package },
  { href: '/admin/dashboard/frames', label: 'Picture Frames', icon: Image },
  { href: '/admin/dashboard/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/dashboard/reviews', label: 'Reviews', icon: Star },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/login', { method: 'DELETE' })
    toast.success('Logged out')
    router.push('/admin/login')
  }

  return (
    <aside
      className="w-60 min-h-screen flex flex-col bg-white"
      style={{ borderRight: '1px solid #C8DFF0' }}
    >
      {/* Logo */}
      <div className="px-5 py-4" style={{ borderBottom: '1px solid #C8DFF0' }}>
        <Link href="/admin/dashboard" aria-label="Admin dashboard">
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
                  : {
                      fontFamily: 'Outfit, sans-serif',
                    }
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3" style={{ borderTop: '1px solid #C8DFF0' }}>
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
