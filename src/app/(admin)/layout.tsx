import AdminSidebar from '@/components/layout/AdminSidebar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      {/* Desktop sidebar */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile: no sidebar shown (handled in Navbar area) */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
