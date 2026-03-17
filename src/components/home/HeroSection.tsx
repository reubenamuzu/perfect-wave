'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Wifi, Frame, Zap, PlayCircle } from 'lucide-react'
import NetworkBadge from '@/components/shared/NetworkBadge'
import { useTour } from '@/components/shared/SiteTour'

const STAGGER_CHILDREN = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const FADE_UP = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const NETWORK_CARDS = [
  {
    key: 'mtn',
    name: 'MTN',
    accent: '#FFC107',
    accentDim: 'rgba(255,193,7,0.18)',
    accentGlow: 'rgba(255,193,7,0.35)',
    tagline: 'Ghana\'s Biggest Network',
    sizes: ['1GB', '2GB', '5GB', '10GB'],
    bars: [4, 4, 4],
  },
  {
    key: 'telecel',
    name: 'Telecel',
    accent: '#FF3B4E',
    accentDim: 'rgba(255,59,78,0.18)',
    accentGlow: 'rgba(255,59,78,0.35)',
    tagline: 'Fast & Reliable Data',
    sizes: ['1GB', '3GB', '5GB', '10GB'],
    bars: [3, 4, 4],
  },
  {
    key: 'airteltigo',
    name: 'AirtelTigo',
    accent: '#4A9EFF',
    accentDim: 'rgba(74,158,255,0.18)',
    accentGlow: 'rgba(74,158,255,0.35)',
    tagline: 'Nationwide Coverage',
    sizes: ['1.5GB', '3GB', '5GB', '15GB'],
    bars: [3, 3, 4],
  },
] as const

export default function HeroSection() {
  const [activeCard, setActiveCard] = useState(0)
  const { startTour } = useTour()

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % NETWORK_CARDS.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const card = NETWORK_CARDS[activeCard]

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f4f8fc 45%, #EAF3FB 100%)' }}
      />

      {/* Decorative wave arc — top right */}
      <div className="absolute top-0 right-0 w-130 h-130 pointer-events-none opacity-[0.07]">
        <svg viewBox="0 0 520 520" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="520" cy="0" r="380" stroke="#1B6CA8" strokeWidth="60" />
          <circle cx="520" cy="0" r="280" stroke="#1B6CA8" strokeWidth="40" />
          <circle cx="520" cy="0" r="180" stroke="#1B6CA8" strokeWidth="24" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Left — text (content unchanged) */}
          <motion.div variants={STAGGER_CHILDREN} initial="hidden" animate="visible">
            <motion.p
              variants={FADE_UP}
              className="text-sm font-medium tracking-widest uppercase text-[#1B6CA8] mb-5"
              style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 400 }}
            >
              Ride the wave of smart connections
            </motion.p>

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

            <motion.p
              variants={FADE_UP}
              className="text-base lg:text-lg text-[#5A7A99] leading-relaxed mb-8 max-w-md"
              style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
            >
              PerfectWave Services brings you affordable MTN, Telecel &amp; AirtelTigo data
              bundles alongside premium custom picture frames — all in one place.
            </motion.p>

            <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 mb-8 w-full max-w-xs sm:max-w-none mx-auto sm:mx-0">
              <Link href="/shop" className="flex-1 sm:flex-none">
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1B6CA8] text-white px-7 py-3.5 rounded-[10px] text-sm hover:bg-[#0D4F82] transition-colors"
                  style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
                >
                  <Wifi className="w-4 h-4" />
                  Shop Data Bundles
                </motion.button>
              </Link>
              <Link href="/shop?tab=frames" className="flex-1 sm:flex-none">
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#1B6CA8] text-[#1B6CA8] bg-transparent px-7 py-3.5 rounded-[10px] text-sm hover:bg-[#EAF3FB] transition-colors"
                  style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
                >
                  <Frame className="w-4 h-4" />
                  Design Your Frame
                </motion.button>
              </Link>
            </motion.div>

            <motion.div variants={FADE_UP}>
              <button
                onClick={startTour}
                className="flex items-center gap-2 text-sm text-[#5A7A99] hover:text-[#1B6CA8] transition-colors mt-1"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                <PlayCircle className="w-4 h-4" />
                New here? Take a quick tour
              </button>
            </motion.div>

            <motion.div variants={FADE_UP} className="flex items-center gap-3">
              <span className="text-xs text-[#5A7A99] mr-1" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
                All networks:
              </span>
              {(['mtn', 'telecel', 'airteltigo'] as const).map((n) => (
                <NetworkBadge key={n} network={n} size="sm" />
              ))}
            </motion.div>
          </motion.div>

          {/* Right — dark premium network card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: 'easeOut' }}
            className="flex items-center justify-center"
          >
            <div className="w-full max-w-sm">
              {/* Glow ring that transitions color */}
              <motion.div
                animate={{ boxShadow: `0 0 0 3px ${card.accent}, 0 24px 64px ${card.accentGlow}` }}
                transition={{ duration: 0.5 }}
                className="rounded-[28px] overflow-hidden"
              >
                {/* Slider viewport */}
                <div className="overflow-hidden rounded-[28px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={card.key}
                      initial={{ x: '100%', opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: '-100%', opacity: 0 }}
                      transition={{ duration: 0.45, ease: 'easeInOut' }}
                      className="relative w-full p-7 overflow-hidden"
                      style={{ background: '#0D1B2A', minHeight: 280 }}
                    >
                      {/* Giant watermark initial */}
                      <div
                        className="absolute -right-4 -bottom-6 text-[10rem] font-black leading-none select-none pointer-events-none"
                        style={{
                          color: card.accent,
                          opacity: 0.07,
                          fontFamily: 'Plus Jakarta Sans, sans-serif',
                        }}
                      >
                        {card.name[0]}
                      </div>

                      {/* Accent gradient orb top-left */}
                      <div
                        className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                        style={{ backgroundColor: card.accentGlow }}
                      />

                      {/* Top row: NETWORK label + signal bars */}
                      <div className="relative z-10 flex items-center justify-between mb-5">
                        <span
                          className="text-[10px] tracking-[0.2em] uppercase font-semibold"
                          style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Outfit, sans-serif' }}
                        >
                          Network
                        </span>
                        {/* Animated signal bars */}
                        <div className="flex items-end gap-[3px]">
                          {[3, 5, 7, 9].map((h, i) => (
                            <motion.div
                              key={i}
                              className="w-1 rounded-sm"
                              style={{ height: h, backgroundColor: card.accent }}
                              animate={{ opacity: [0.4, 1, 0.4] }}
                              transition={{ duration: 1.4, delay: i * 0.15, repeat: Infinity }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Network name */}
                      <div className="relative z-10 flex items-center gap-3 mb-1">
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-black shrink-0"
                          style={{
                            backgroundColor: card.accentDim,
                            color: card.accent,
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                            border: `1.5px solid ${card.accent}55`,
                          }}
                        >
                          {card.name[0]}
                        </div>
                        <div>
                          <p
                            className="text-2xl font-bold leading-tight"
                            style={{ color: '#ffffff', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                          >
                            {card.name}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: 'rgba(255,255,255,0.40)', fontFamily: 'Outfit, sans-serif' }}
                          >
                            {card.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="relative z-10 my-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />

                      {/* Sizes row */}
                      <div className="relative z-10 mb-5">
                        <p
                          className="text-[10px] uppercase tracking-widest font-semibold mb-2.5"
                          style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Outfit, sans-serif' }}
                        >
                          Available Plans
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {card.sizes.map((s) => (
                            <span
                              key={s}
                              className="text-xs font-bold px-3 py-1 rounded-full"
                              style={{
                                backgroundColor: card.accentDim,
                                color: card.accent,
                                fontFamily: 'Outfit, sans-serif',
                                border: `1px solid ${card.accent}33`,
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom row: INSTANT badge + dots */}
                      <div className="relative z-10 flex items-center justify-between">
                        {/* INSTANT pill */}
                        <motion.div
                          animate={{ boxShadow: [`0 0 0px ${card.accent}`, `0 0 12px ${card.accent}88`, `0 0 0px ${card.accent}`] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                          style={{ backgroundColor: card.accentDim, border: `1px solid ${card.accent}55` }}
                        >
                          <Zap className="w-3 h-3" style={{ color: card.accent }} />
                          <span
                            className="text-[10px] font-bold tracking-widest"
                            style={{ color: card.accent, fontFamily: 'Outfit, sans-serif' }}
                          >
                            INSTANT DELIVERY
                          </span>
                        </motion.div>

                        {/* Dots */}
                        <div className="flex items-center gap-1.5">
                          {NETWORK_CARDS.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveCard(i)}
                              aria-label={`Show ${NETWORK_CARDS[i].name}`}
                              className="rounded-full transition-all duration-300"
                              style={{
                                width: i === activeCard ? 18 : 6,
                                height: 6,
                                backgroundColor:
                                  i === activeCard ? card.accent : 'rgba(255,255,255,0.2)',
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
