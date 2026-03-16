'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NETWORKS } from '@/lib/networkConfig'
import NetworkBadge from '@/components/shared/NetworkBadge'
import { buildWhatsAppURL, bundleOrderMessage } from '@/lib/whatsapp'
import { formatPrice } from '@/lib/utils'
import type { IBundle } from '@/types'

interface FeaturedBundlesProps {
  bundles: IBundle[]
}

export default function FeaturedBundles({ bundles }: FeaturedBundlesProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p
              className="text-xs tracking-widest uppercase text-[#1B6CA8] mb-1"
              style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 400 }}
            >
              Popular Plans
            </p>
            <h2
              className="text-3xl text-[#1A2E42]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
            >
              Popular Data Bundles
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm transition-all hover:gap-3 text-[#1B6CA8]"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {bundles.slice(0, 3).map((bundle, i) => {
            const net = NETWORKS[bundle.network]
            const waUrl = buildWhatsAppURL(bundleOrderMessage(net.label, bundle.size, bundle.price))
            return (
              <motion.div
                key={bundle._id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(27,108,168,0.12)' }}
                className="bg-white rounded-2xl overflow-hidden"
                style={{
                  border: '1px solid #C8DFF0',
                  borderTop: `3px solid ${net.primaryColor}`,
                  boxShadow: '0 2px 12px rgba(27,108,168,0.06)',
                }}
              >
                {/* Header */}
                <div className="px-4 pt-4 pb-3 flex items-center gap-3">
                  <NetworkBadge network={bundle.network} />
                  <div>
                    <p className="text-sm text-[#1A2E42]" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}>
                      {net.label}
                    </p>
                    <p className="text-xs text-[#5A7A99]" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
                      {bundle.validity}
                    </p>
                  </div>
                  {bundle.badge && (
                    <span
                      className="ml-auto text-[10px] px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: net.primaryColor, fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
                    >
                      {bundle.badge}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="px-4 pb-4 border-t border-[#EAF3FB] pt-3">
                  <div
                    className="text-4xl mb-0.5"
                    style={{ color: net.primaryColor, fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}
                  >
                    {bundle.size}
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
                      style={{ backgroundColor: '#1B6CA8', fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
                      aria-label={`Order ${net.label} ${bundle.size} bundle`}
                    >
                      Order via WhatsApp
                    </Button>
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm text-[#1B6CA8]"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
          >
            View all bundles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
