'use client'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { buildWhatsAppURL } from '@/lib/whatsapp'
import { useSettings } from '@/components/shared/SettingsContext'

export default function WhatsAppButton() {
  const { whatsappNumber } = useSettings()
  const url = buildWhatsAppURL('Hello! I would like to place an order.', whatsappNumber)

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      id="whatsapp-float-btn"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-13 h-13 rounded-full"
      style={{ backgroundColor: '#25D366', boxShadow: '0 4px 16px rgba(37,211,102,0.35)' }}
      animate={{ scale: [1, 1.06, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle className="w-6 h-6 text-white fill-white" />
    </motion.a>
  )
}
