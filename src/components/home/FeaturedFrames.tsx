'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Frame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import type { IFrame } from '@/types'
import OrderModal, { type OrderProduct } from '@/components/shared/OrderModal'

interface FeaturedFramesProps {
  frames: IFrame[]
}

export default function FeaturedFrames({ frames }: FeaturedFramesProps) {
  const [selected, setSelected] = useState<OrderProduct | null>(null)

  return (
    <section id="frames-section" className="py-20" style={{ backgroundColor: '#F4F8FC' }}>
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
              Custom Frames
            </p>
            <h2
              className="text-3xl text-[#1A2E42]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
            >
              Our Picture Frames
            </h2>
          </div>
          <Link
            href="/shop?tab=frames"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm transition-all hover:gap-3 text-[#1B6CA8]"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {frames.slice(0, 3).map((frame, i) => (
            <motion.div
              key={frame._id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(27,108,168,0.10)' }}
              className="bg-white rounded-2xl overflow-hidden"
              style={{ border: '1px solid #C8DFF0', boxShadow: '0 2px 12px rgba(27,108,168,0.06)' }}
            >
              {/* Image */}
              <div className="relative h-48 bg-[#EAF3FB]">
                {frame.imageUrl ? (
                  <Image src={frame.imageUrl} alt={frame.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Frame className="w-10 h-10" style={{ color: '#C8DFF0' }} />
                  </div>
                )}
                {frame.badge && (
                  <span
                    className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: '#1B6CA8', fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
                  >
                    {frame.badge}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3
                  className="text-[#1A2E42] text-base mb-1"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
                >
                  {frame.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full text-[#1B6CA8]"
                    style={{ backgroundColor: '#EAF3FB', fontFamily: 'Outfit, sans-serif', fontWeight: 400 }}
                  >
                    {frame.material}
                  </span>
                  {frame.sizes.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="text-xs px-2 py-0.5 rounded-full text-[#5A7A99]"
                      style={{ backgroundColor: '#F4F8FC', border: '1px solid #C8DFF0', fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div
                  className="text-xl text-[#1B6CA8] mb-4"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
                >
                  {formatPrice(frame.price)}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      setSelected({
                        type: 'frame',
                        name: frame.name,
                        price: frame.price,
                        size: frame.sizes[0] ?? '4x6',
                      })
                    }
                    className="flex-1 text-white text-sm rounded-[10px] hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#1B6CA8', fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
                  >
                    Order via WhatsApp
                  </Button>
                  <Link href={`/frame-designer?frame=${frame._id}`}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0 rounded-[10px] border-[#C8DFF0] text-[#1B6CA8] hover:bg-[#EAF3FB]"
                      aria-label="Design with my photo"
                    >
                      <Frame className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/shop?tab=frames"
            className="inline-flex items-center gap-1.5 text-sm text-[#1B6CA8]"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
          >
            View all frames <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {selected && (
        <OrderModal
          isOpen={true}
          onClose={() => setSelected(null)}
          product={selected}
        />
      )}
    </section>
  )
}
