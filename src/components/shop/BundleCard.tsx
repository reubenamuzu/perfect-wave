'use client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import NetworkBadge from '@/components/shared/NetworkBadge'
import { NETWORKS } from '@/lib/networkConfig'
import { buildWhatsAppURL, bundleOrderMessage } from '@/lib/whatsapp'
import { formatPrice } from '@/lib/utils'
import type { IBundle } from '@/types'

interface BundleCardProps {
  bundle: IBundle
  index?: number
}

export default function BundleCard({ bundle, index = 0 }: BundleCardProps) {
  const net = NETWORKS[bundle.network]
  const waUrl = buildWhatsAppURL(bundleOrderMessage(net.label, bundle.size, bundle.price))

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(27,108,168,0.12)' }}
      className="bg-white rounded-2xl overflow-hidden"
      style={{
        border: '1px solid #C8DFF0',
        boxShadow: '0 2px 12px rgba(27,108,168,0.06)',
        borderTop: `3px solid ${net.primaryColor}`,
      }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3">
        <NetworkBadge network={bundle.network} size="sm" />
        <div className="flex-1 min-w-0">
          <p
            className="text-sm leading-none text-[#1A2E42]"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
          >
            {net.label}
          </p>
          <p
            className="text-xs text-[#5A7A99] mt-0.5"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
          >
            {bundle.validity}
          </p>
        </div>
        {bundle.badge && (
          <span
            className="shrink-0 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide text-white"
            style={{ backgroundColor: net.primaryColor, fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
          >
            {bundle.badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-4 pb-4">
        <div className="border-t border-[#EAF3FB] pt-3 mb-3">
          <div
            className="text-3xl leading-none mb-0.5"
            style={{ color: net.primaryColor, fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}
          >
            {bundle.size}
          </div>
          <div
            className="text-xs text-[#5A7A99] capitalize"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
          >
            {bundle.category} bundle
          </div>
        </div>

        <div
          className="text-xl text-[#1B6CA8] mb-4"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
        >
          {formatPrice(bundle.price)}
        </div>

        <a href={waUrl} target="_blank" rel="noopener noreferrer">
          <Button
            className="w-full text-white text-sm rounded-[10px] hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: '#1B6CA8',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 500,
            }}
            aria-label={`Order ${net.label} ${bundle.size} bundle for ${formatPrice(bundle.price)}`}
          >
            Order via WhatsApp
          </Button>
        </a>
      </div>
    </motion.div>
  )
}
