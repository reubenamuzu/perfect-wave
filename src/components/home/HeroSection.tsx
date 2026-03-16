'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Wifi, Frame } from 'lucide-react'
import NetworkBadge from '@/components/shared/NetworkBadge'

const STAGGER_CHILDREN = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const FADE_UP = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(160deg, #ffffff 0%, #f4f8fc 45%, #EAF3FB 100%)',
        }}
      />

      {/* Decorative wave arc — top right */}
      <div className="absolute top-0 right-0 w-130 h-130 pointer-events-none opacity-[0.07]">
        <svg viewBox="0 0 520 520" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="520" cy="0" r="380" stroke="#1B6CA8" strokeWidth="60" />
          <circle cx="520" cy="0" r="280" stroke="#1B6CA8" strokeWidth="40" />
          <circle cx="520" cy="0" r="180" stroke="#1B6CA8" strokeWidth="24" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Left — text */}
          <motion.div
            variants={STAGGER_CHILDREN}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow */}
            <motion.p
              variants={FADE_UP}
              className="text-sm font-medium tracking-widest uppercase text-[#1B6CA8] mb-5"
              style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 400 }}
            >
              Ride the wave of smart connections
            </motion.p>

            {/* Headline */}
            <motion.h1
              variants={FADE_UP}
              className="text-4xl sm:text-[2.8rem] lg:text-5xl leading-[1.15] text-[#1A2E42] mb-5"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
            >
              Fast Data Bundles &{' '}
              <span className="text-[#1B6CA8]">Beautiful</span>
              <br />
              Picture Frames
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={FADE_UP}
              className="text-base lg:text-lg text-[#5A7A99] leading-relaxed mb-8 max-w-md"
              style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
            >
              PerfectWave Services brings you affordable MTN, Telecel &amp; AirtelTigo data
              bundles alongside premium custom picture frames — all in one place.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={FADE_UP} className="flex flex-wrap gap-3 mb-8">
              <Link href="/shop">
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-[#1B6CA8] text-white px-7 py-3 rounded-[10px] text-sm hover:bg-[#0D4F82] transition-colors"
                  style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
                >
                  <Wifi className="w-4 h-4" />
                  Shop Data Bundles
                </motion.button>
              </Link>
              <Link href="/shop?tab=frames">
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 border border-[#1B6CA8] text-[#1B6CA8] bg-transparent px-7 py-3 rounded-[10px] text-sm hover:bg-[#EAF3FB] transition-colors"
                  style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
                >
                  <Frame className="w-4 h-4" />
                  Design Your Frame
                </motion.button>
              </Link>
            </motion.div>

            {/* Network badges row */}
            <motion.div variants={FADE_UP} className="flex items-center gap-3">
              <span
                className="text-xs text-[#5A7A99] mr-1"
                style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
              >
                All networks:
              </span>
              {(['mtn', 'telecel', 'airteltigo'] as const).map((n) => (
                <NetworkBadge key={n} network={n} size="sm" />
              ))}
            </motion.div>
          </motion.div>

          {/* Right — floating card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: 'easeOut' }}
            className="flex items-center justify-center"
          >
            <div
              className="w-full max-w-sm rounded-2xl p-6"
              style={{
                background: '#ffffff',
                border: '1px solid #C8DFF0',
                boxShadow: '0 8px 32px rgba(27,108,168,0.10)',
              }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p
                    className="text-xs text-[#5A7A99] mb-1 tracking-wide uppercase"
                    style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
                  >
                    All Network Available
                  </p>
                  <p
                    className="text-lg text-[#1A2E42]"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
                  >
                    PerfectWave Services
                  </p>
                </div>
                <div className="flex -space-x-2">
                  {(['mtn', 'telecel', 'airteltigo'] as const).map((n) => (
                    <NetworkBadge key={n} network={n} size="sm" />
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#C8DFF0] mb-5" />

              {/* Bundle preview rows */}
              {[
                { size: '5GB', validity: '30 days', price: 'GH¢ 24', network: 'mtn', color: '#FFC107' },
                { size: '10GB', validity: '30 days', price: 'GH¢ 45', network: 'telecel', color: '#E3000B' },
                { size: '20GB', validity: '30 days', price: 'GH¢ 85', network: 'airteltigo', color: '#003B8E' },
              ].map((row) => (
                <div
                  key={row.size}
                  className="flex items-center justify-between py-2.5 border-b border-[#EAF3FB] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: row.color }}
                    />
                    <span
                      className="text-sm text-[#1A2E42]"
                      style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
                    >
                      {row.size}
                    </span>
                    <span
                      className="text-xs text-[#5A7A99]"
                      style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
                    >
                      {row.validity}
                    </span>
                  </div>
                  <span
                    className="text-sm text-[#1B6CA8]"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
                  >
                    {row.price}
                  </span>
                </div>
              ))}

              {/* CTA */}
              <Link href="/shop" className="block mt-5">
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 bg-[#1B6CA8] text-white py-2.5 rounded-[10px] text-sm hover:bg-[#0D4F82] transition-colors"
                  style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
                >
                  View all bundles
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
