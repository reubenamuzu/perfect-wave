'use client'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import AdminSidebar from '@/components/layout/AdminSidebar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#F4F8FC]">
      {/* Desktop sidebar */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div
          className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white"
          style={{ borderBottom: '1px solid #C8DFF0' }}
        >
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="p-2 rounded-lg text-[#1A2E42] hover:bg-[#EAF3FB] transition-colors"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-60">
              <AdminSidebar />
            </SheetContent>
          </Sheet>
          <span
            className="text-sm font-medium text-[#1A2E42]"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            PerfectWave Admin
          </span>
        </div>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
