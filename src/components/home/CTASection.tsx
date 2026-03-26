'use client'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { buildWhatsAppURL } from '@/lib/whatsapp'
import { useSettings } from '@/components/shared/SettingsContext'

export default function CTASection() {
  const { whatsappNumber } = useSettings()
  return (
    <section className="py-16" style={{ backgroundColor: '#EAF3FB' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p
            className="text-xs tracking-widest uppercase text-[#1B6CA8] mb-3"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 400 }}
          >
            Get in touch
          </p>
          <h2
            className="text-3xl text-[#1A2E42] mb-4"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
          >
            Ready to Order?
          </h2>
          <p
            className="text-[#5A7A99] text-base mb-8 max-w-sm mx-auto"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
          >
            Chat with us directly on WhatsApp — we respond within minutes.
          </p>
          <motion.a
            href={buildWhatsAppURL('Hello! I would like to place an order.', whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-white px-8 py-3.5 rounded-[10px] text-sm transition-colors"
            style={{ backgroundColor: '#25D366', fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#20ba5a')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#25D366')}
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            Chat with us on WhatsApp
          </motion.a>
          <p
            className="text-xs text-[#5A7A99] mt-4"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
          >
            0597 473 708
          </p>
        </motion.div>
      </div>
    </section>
  )
}
