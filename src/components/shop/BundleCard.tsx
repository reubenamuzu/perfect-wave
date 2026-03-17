'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wifi } from 'lucide-react'
import { NETWORKS } from '@/lib/networkConfig'
import { formatPrice } from '@/lib/utils'
import type { IBundle } from '@/types'
import OrderModal from '@/components/shared/OrderModal'

interface BundleCardProps {
  bundle: IBundle
  index?: number
}

// MTN is yellow (light bg) — everything else is dark background
function isLightBackground(networkId: string) {
  return networkId === 'mtn'
}

export default function BundleCard({ bundle, index = 0 }: BundleCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const net = NETWORKS[bundle.network]
  const light = isLightBackground(bundle.network)

  const textColor = light ? '#3D2800' : '#ffffff'
  const subTextColor = light ? 'rgba(61,40,0,0.65)' : 'rgba(255,255,255,0.75)'
  const badgeBg = light ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.2)'
  const iconCircleBg = light ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.15)'

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
        whileHover={{ y: -4, scale: 1.02 }}
        className="rounded-2xl overflow-hidden cursor-pointer"
        style={{
          backgroundColor: net.primaryColor,
          boxShadow: `0 4px 20px ${net.primaryColor}55`,
        }}
      >
        {/* Top row: network pill left, badge right */}
        <div className="px-4 pt-4 pb-1 flex items-center justify-between">
          <span
            className="inline-block text-[11px] px-3 py-1 rounded-full uppercase tracking-widest"
            style={{
              backgroundColor: '#ffffff',
              color: net.primaryColor,
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 600,
            }}
          >
            {net.abbr}
          </span>
          {bundle.badge && (
            <span
              className="inline-block text-[11px] px-3 py-1 rounded-full uppercase tracking-widest"
              style={{
                backgroundColor: '#ffffff',
                color: net.primaryColor,
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 600,
              }}
            >
              {bundle.badge}
            </span>
          )}
        </div>

        {/* Card body */}
        <div className="px-4 pb-2 pt-3 flex flex-col items-center text-center">
          {/* WiFi icon in circle */}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: iconCircleBg }}
          >
            <Wifi
              className="w-7 h-7"
              style={{ color: light ? 'rgba(61,40,0,0.7)' : 'rgba(255,255,255,0.85)' }}
            />
          </div>

          {/* Size — Price */}
          <p
            className="text-2xl leading-tight mb-1"
            style={{ color: textColor, fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
          >
            {bundle.size} — {bundle.price !== null ? formatPrice(bundle.price) : 'Call us'}
          </p>

          {/* DATA BUNDLE label */}
          <p
            className="text-[11px] tracking-widest uppercase mb-3"
            style={{ color: subTextColor, fontFamily: 'Outfit, sans-serif', fontWeight: 400 }}
          >
            Data Bundle
          </p>

          {/* Validity pill */}
          <span
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full mb-5"
            style={{
              backgroundColor: badgeBg,
              color: textColor,
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 400,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: textColor }}
            />
            {bundle.validity}
          </span>
        </div>

        {/* Order button */}
        <div className="px-4 pb-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setModalOpen(true)}
            className="w-full py-3 rounded-xl text-sm"
            style={{
              backgroundColor: '#ffffff',
              color: light ? '#3D2800' : '#1A2E42',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 600,
            }}
            aria-label={`Order ${net.label} ${bundle.size} bundle`}
          >
            Order via WhatsApp
          </motion.button>
        </div>
      </motion.div>

      <OrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={{
          type: 'bundle',
          name: `${net.label} ${bundle.size} Bundle`,
          price: bundle.price,
          network: net.label,
          size: bundle.size,
        }}
      />
    </>
  )
}
