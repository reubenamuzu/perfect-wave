'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Wifi, Frame, ArrowRight } from 'lucide-react'

export default function ServicesSection() {
  return (
    <section className="py-20" style={{ backgroundColor: '#F4F8FC' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p
            className="text-xs tracking-widest uppercase text-[#1B6CA8] mb-2"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 400 }}
          >
            What We Offer
          </p>
          <h2
            className="text-3xl text-[#1A2E42]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
          >
            Two Services, One Destination
          </h2>
          <p
            className="text-[#5A7A99] mt-3 max-w-xl mx-auto"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
          >
            From fast internet to lasting memories — we've got you covered.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data Bundles */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(27,108,168,0.12)' }}
            className="rounded-2xl p-8 relative overflow-hidden"
            style={{ backgroundColor: '#0D4F82', boxShadow: '0 2px 12px rgba(27,108,168,0.10)' }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full -translate-y-1/2 translate-x-1/2 opacity-10"
              style={{ backgroundColor: '#7BB8E0' }} />
            <div className="relative z-10">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <Wifi className="w-5 h-5 text-white" />
              </div>
              <h3
                className="text-xl text-white mb-3"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
              >
                Data Bundles
              </h3>
              <p
                className="text-sm mb-5 leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
              >
                Affordable data packages for MTN, Telecel, and AirtelTigo. Daily, weekly, and
                monthly plans to suit every need.
              </p>
              <div className="flex gap-2 mb-6">
                {[
                  { label: 'MTN', color: '#FFC107', text: '#5D4037' },
                  { label: 'Telecel', color: '#E3000B', text: '#fff' },
                  { label: 'AirtelTigo', color: '#003B8E', text: '#fff' },
                ].map((n) => (
                  <div
                    key={n.label}
                    className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
                    style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: n.color }} />
                    <span
                      className="text-xs text-white"
                      style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 400 }}
                    >
                      {n.label}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm transition-all hover:gap-3"
                style={{ color: '#7BB8E0', fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
              >
                Explore bundles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Picture Frames */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(27,108,168,0.10)' }}
            className="rounded-2xl p-8 relative overflow-hidden bg-white"
            style={{ border: '1px solid #C8DFF0', boxShadow: '0 2px 12px rgba(27,108,168,0.06)' }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full -translate-y-1/2 translate-x-1/2 opacity-[0.06]"
              style={{ backgroundColor: '#1B6CA8' }} />
            <div className="relative z-10">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: '#EAF3FB' }}
              >
                <Frame className="w-5 h-5" style={{ color: '#1B6CA8' }} />
              </div>
              <h3
                className="text-xl text-[#1A2E42] mb-3"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
              >
                Picture Frames
              </h3>
              <p
                className="text-sm mb-5 leading-relaxed text-[#5A7A99]"
                style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
              >
                Premium wood, metal &amp; plastic frames. Custom sizes from 4×6 to A4. Upload
                your photo and design your perfect frame.
              </p>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {['#EAF3FB', '#D6E8F5', '#EAF3FB', '#D6E8F5'].map((color, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: color, border: '1px solid #C8DFF0' }}
                  >
                    <Frame className="w-4 h-4" style={{ color: '#1B6CA8', opacity: 0.5 }} />
                  </div>
                ))}
              </div>
              <Link
                href="/shop?tab=frames"
                className="inline-flex items-center gap-2 text-sm transition-all hover:gap-3 text-[#1B6CA8]"
                style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
              >
                Explore frames <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
