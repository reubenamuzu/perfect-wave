'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import { TourProvider } from '@/components/shared/SiteTour'

// Hides public chrome (Navbar, WhatsApp button) on admin routes
export default function PublicShell() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/dashboard') || pathname === '/login'
  if (isAdmin) return null
  return (
    <TourProvider>
      <Navbar />
      <WhatsAppButton />
    </TourProvider>
  )
}
