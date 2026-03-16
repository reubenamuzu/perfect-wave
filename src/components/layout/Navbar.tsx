'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, MessageCircle, LayoutDashboard } from 'lucide-react'
import { buildWhatsAppURL } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'
import PerfectWaveLogo from '@/components/shared/PerfectWaveLogo'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/frame-designer', label: 'Frame Designer' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/track-order', label: 'Track Order' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full bg-white transition-all duration-300',
        scrolled ? 'shadow-[0_2px_16px_rgba(27,108,168,0.08)]' : 'border-b border-[#C8DFF0]'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" aria-label="PerfectWave Services home">
            <PerfectWaveLogo size="md" variant="dark" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3.5 py-2 text-sm rounded-lg transition-colors',
                  pathname === link.href
                    ? 'text-[#1B6CA8] bg-[#EAF3FB] font-medium'
                    : 'text-[#5A7A99] hover:text-[#1B6CA8] hover:bg-[#F4F8FC] font-normal'
                )}
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-[10px] border border-[#C8DFF0] text-[#5A7A99] hover:text-[#1B6CA8] hover:border-[#1B6CA8] hover:bg-[#EAF3FB] transition-colors"
              style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin
            </Link>
            <a
              href={buildWhatsAppURL('Hello! I want to place an order.')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Order on WhatsApp"
            >
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center bg-accent gap-2 border border-[#1B6CA8] text-[#1B6CA8] px-5 py-2 rounded-[10px] text-sm hover:bg-[#1B6CA8] hover:text-white transition-colors"
                style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
              >
                <MessageCircle className="w-4 h-4" />
                Order Now
              </motion.button>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-[#1A2E42] p-2 rounded-lg hover:bg-[#EAF3FB] transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-[#C8DFF0] bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'block px-3 py-2.5 text-sm rounded-lg transition-colors',
                    pathname === link.href
                      ? 'text-[#1B6CA8] bg-[#EAF3FB] font-medium'
                      : 'text-[#5A7A99] hover:text-[#1B6CA8] hover:bg-[#F4F8FC]'
                  )}
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 space-y-2">
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 w-full border border-[#C8DFF0] text-[#5A7A99] px-5 py-2.5 rounded-[10px] text-sm hover:bg-[#EAF3FB] hover:text-[#1B6CA8] transition-colors"
                  style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </Link>
                <a
                  href={buildWhatsAppURL('Hello! I want to place an order.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full border border-[#1B6CA8] text-[#1B6CA8] px-5 py-2.5 rounded-[10px] text-sm hover:bg-[#1B6CA8] hover:text-white transition-colors"
                  style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Order on WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
