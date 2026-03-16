'use client'
import { motion } from 'framer-motion'
import { ShoppingCart, MessageCircle, Package } from 'lucide-react'

const STEPS = [
  {
    icon: ShoppingCart,
    title: 'Browse & Choose',
    desc: 'Pick your data bundle or picture frame from our wide selection.',
    color: '#1B6CA8',
    num: 1,
  },
  {
    icon: MessageCircle,
    title: 'Order via WhatsApp',
    desc: 'Tap Order — it opens WhatsApp with your details pre-filled. Easy!',
    color: '#25D366',
    num: 2,
  },
  {
    icon: Package,
    title: 'SMS Updates',
    desc: 'We process your order and keep you updated via SMS every step.',
    color: '#0D4F82',
    num: 3,
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p
            className="text-xs tracking-widest uppercase text-[#1B6CA8] mb-2"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 400 }}
          >
            Simple Process
          </p>
          <h2
            className="text-3xl text-[#1A2E42]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
          >
            How It Works
          </h2>
          <p
            className="text-[#5A7A99] mt-3 max-w-md mx-auto"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
          >
            Ordering is simple — just 3 easy steps.
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Connector line */}
          <div
            className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px"
            style={{ background: 'linear-gradient(90deg, #1B6CA8, #25D366, #0D4F82)' }}
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="flex flex-col items-center text-center relative"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 relative z-10"
                style={{ backgroundColor: step.color, boxShadow: `0 4px 16px ${step.color}33` }}
              >
                <step.icon className="w-8 h-8 text-white" />
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs flex items-center justify-center"
                  style={{ backgroundColor: '#1A2E42', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
                >
                  {step.num}
                </div>
              </div>
              <h3
                className="text-lg text-[#1A2E42] mb-2"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm text-[#5A7A99] leading-relaxed max-w-xs"
                style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
              >
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
