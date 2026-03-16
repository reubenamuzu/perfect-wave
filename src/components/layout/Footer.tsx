import Link from 'next/link'
import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram } from 'lucide-react'
import { buildWhatsAppURL } from '@/lib/whatsapp'
import PerfectWaveLogo from '@/components/shared/PerfectWaveLogo'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0D4F82' }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" aria-label="PerfectWave Services home">
              <PerfectWaveLogo size="md" variant="light" />
            </Link>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
            >
              Ride the wave of smart connections. Affordable data bundles and premium custom picture
              frames in Ghana.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.22)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.22)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={buildWhatsAppURL('Hello!')}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#25D366')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="text-sm mb-4"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, letterSpacing: '0.05em' }}
            >
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
              {[
                { href: '/shop', label: 'Shop Data Bundles' },
                { href: '/shop?tab=frames', label: 'Picture Frames' },
                { href: '/frame-designer', label: 'Frame Designer' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/reviews', label: 'Reviews' },
                { href: '/track-order', label: 'Track Order' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Networks */}
          <div>
            <h3
              className="text-sm mb-4"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, letterSpacing: '0.05em' }}
            >
              Networks We Serve
            </h3>
            <ul
              className="space-y-2.5 text-sm"
              style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
            >
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFC107] shrink-0" />
                MTN Ghana
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E3000B] shrink-0" />
                Telecel Ghana
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#7BB8E0] shrink-0" />
                AirtelTigo Ghana
              </li>
              <li
                className="text-xs pt-2 border-t mt-2"
                style={{ borderColor: 'rgba(255,255,255,0.15)' }}
              >
                All networks — same great prices
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="text-sm mb-4"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, letterSpacing: '0.05em' }}
            >
              Contact Us
            </h3>
            <ul
              className="space-y-3 text-sm"
              style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
            >
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#7BB8E0' }} />
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Kumasi, Ashanti Region, Ghana</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" style={{ color: '#7BB8E0' }} />
                <a
                  href="tel:+233597473708"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                  className="hover:text-white transition-colors"
                >
                  0597 473 708
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 shrink-0" style={{ color: '#25D366' }} />
                <a
                  href={buildWhatsAppURL('Hello! I would like to place an order.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: 0597 473 708
                </a>
              </li>
              <li
                className="text-xs pt-1"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                Mon–Sat: 8am – 7pm<br />
                Sun: 10am – 5pm
              </li>
            </ul>
          </div>

        </div>

        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
          style={{ borderTop: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.45)', fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
        >
          <p>© {new Date().getFullYear()} PerfectWave Services. All rights reserved.</p>
          <p>Ride the wave of smart connections 🌊</p>
        </div>
      </div>
    </footer>
  )
}
