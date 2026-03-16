'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Frame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buildWhatsAppURL, frameOrderMessage } from '@/lib/whatsapp'
import { formatPrice } from '@/lib/utils'
import type { IFrame } from '@/types'

interface FrameCardProps {
  frame: IFrame
  index?: number
}

export default function FrameCard({ frame, index = 0 }: FrameCardProps) {
  const waUrl = buildWhatsAppURL(frameOrderMessage(frame.name, frame.sizes[0] ?? '4x6', frame.price))

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(27,108,168,0.10)' }}
      className="bg-white rounded-2xl overflow-hidden"
      style={{ border: '1px solid #C8DFF0', boxShadow: '0 2px 12px rgba(27,108,168,0.06)' }}
    >
      {/* Image */}
      <div className="relative h-52" style={{ backgroundColor: '#EAF3FB' }}>
        {frame.imageUrl ? (
          <Image src={frame.imageUrl} alt={frame.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Frame className="w-12 h-12" style={{ color: '#C8DFF0' }} />
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
      <div className="p-4">
        <h3
          className="text-[#1A2E42] text-base mb-1"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
        >
          {frame.name}
        </h3>
        {frame.description && (
          <p
            className="text-xs text-[#5A7A99] mb-2 line-clamp-2"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
          >
            {frame.description}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 mb-3">
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
          {frame.sizes.length > 3 && (
            <span className="text-xs text-[#5A7A99] px-1 py-0.5">+{frame.sizes.length - 3}</span>
          )}
        </div>
        <div
          className="text-xl text-[#1B6CA8] mb-4"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
        >
          {formatPrice(frame.price)}
        </div>
        <div className="flex gap-2">
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button
              className="w-full text-white text-sm rounded-[10px] hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#1B6CA8', fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
              aria-label={`Order ${frame.name} frame`}
            >
              Order via WhatsApp
            </Button>
          </a>
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
  )
}
