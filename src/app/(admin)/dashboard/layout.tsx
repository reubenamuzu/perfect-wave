'use client'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Menu,
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
import AdminSidebar from '@/components/layout/AdminSidebar'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import PerfectWaveLogo from '@/components/shared/PerfectWaveLogo'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const NAV_ITEMS = [
  { href: '/dashboard',          label: 'Dashboard',      icon: LayoutDashboard },
  { href: '/dashboard/orders',   label: 'Orders',         icon: ShoppingBag },
  { href: '/dashboard/bundles',  label: 'Data Bundles',   icon: Package },
  { href: '/dashboard/frames',   label: 'Picture Frames', icon: Frame },
  { href: '/dashboard/gallery',  label: 'Gallery',        icon: GalleryHorizontal },
  { href: '/dashboard/reviews',  label: 'Reviews',        icon: Star },
  { href: '/dashboard/settings', label: 'Settings',       icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/login', { method: 'DELETE' })
    toast.success('Logged out')
    router.push('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F8FC]">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex shrink-0 h-screen overflow-y-auto">
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile top bar */}
        <div
          className="lg:hidden flex items-center justify-between px-4 py-3 bg-white shrink-0"
          style={{ borderBottom: '1px solid #C8DFF0' }}
        >
          <Link href="/dashboard">
            <PerfectWaveLogo size="sm" />
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="p-2 rounded-lg text-[#1A2E42] hover:bg-[#EAF3FB] transition-colors"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </SheetTrigger>

            <SheetContent side="right" className="p-0 w-72 flex flex-col" style={{ borderLeft: '1px solid #C8DFF0' }}>
              {/* Header */}
              <SheetHeader className="px-5 py-4 border-b border-[#C8DFF0]">
                <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <PerfectWaveLogo size="sm" />
                </Link>
              </SheetHeader>

              {/* Nav links */}
              <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                <p
                  className="text-[10px] tracking-widest uppercase text-[#5A7A99] px-3 mb-2"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  Main Menu
                </p>
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                        isActive
                          ? 'text-[#1B6CA8] font-medium'
                          : 'text-[#5A7A99] hover:text-[#1B6CA8] hover:bg-[#F4F8FC]'
                      )}
                      style={
                        isActive
                          ? { backgroundColor: '#EAF3FB', borderLeft: '3px solid #1B6CA8', fontFamily: 'Outfit, sans-serif' }
                          : { fontFamily: 'Outfit, sans-serif' }
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {label}
                    </Link>
                  )
                })}
              </nav>

              {/* Footer */}
              <div className="px-4 py-4 space-y-2 border-t border-[#C8DFF0]">
                <Link
                  href="/"
                  target="_blank"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-[#5A7A99] hover:text-[#1B6CA8] hover:bg-[#EAF3FB] transition-colors"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  View Site
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout() }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-[#5A7A99] hover:text-red-500 hover:bg-red-50 transition-colors"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Logout
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
