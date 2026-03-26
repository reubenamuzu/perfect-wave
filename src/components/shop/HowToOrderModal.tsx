'use client'
import { useState } from 'react'
import { Info, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import CopyButton from '@/components/shared/CopyButton'
import { useSettings } from '@/components/shared/SettingsContext'

const STEPS = [
  {
    emoji: '🛍️',
    title: 'Browse & Pick',
    description: 'Choose a data bundle or picture frame from the shop.',
  },
  {
    emoji: '📋',
    title: 'Fill in Your Details',
    description: 'Enter your name, phone number, and the number to receive the bundle (or delivery address for frames).',
  },
  {
    emoji: '💬',
    title: 'Send on WhatsApp',
    description: 'Your order opens in WhatsApp with everything pre-filled — just tap Send to confirm.',
  },
  {
    emoji: '💳',
    title: 'Make Payment',
    description: 'Send MoMo to __MOMO__ and share the screenshot on WhatsApp. Cash on delivery available for picture frames.',
  },
  {
    emoji: '✅',
    title: "You're Done!",
    description: 'Your bundle is sent to your number, or your frame is delivered to your address.',
  },
]

export default function HowToOrderModal() {
  const [open, setOpen] = useState(false)
  const { momoNumber } = useSettings()

  return (
    <>
      {/* Banner */}
      <div
        className="flex items-start gap-3 rounded-xl p-4 mb-8 text-sm border"
        style={{ backgroundColor: '#EAF3FB', borderColor: '#C8DFF0', color: '#1B6CA8' }}
      >
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500 }} className="mb-0.5">
            How payment works
          </p>
          <p style={{ fontFamily: 'Outfit, sans-serif', color: '#5A7A99', fontWeight: 400 }}>
            Pay via MoMo to{' '}
            <span className="inline-flex items-center gap-0.5">
              <span className="text-base font-semibold" style={{ color: '#1B6CA8' }}>{momoNumber}</span>
              <CopyButton value={momoNumber} />
            </span>
            {' '}before delivery · Cash on delivery available for picture frames · No online card payments
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          style={{
            backgroundColor: '#1B6CA8',
            color: '#ffffff',
            fontFamily: 'Outfit, sans-serif',
          }}
        >
          How to order
        </button>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-md p-0 gap-0 overflow-hidden rounded-2xl"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          {/* Header */}
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ backgroundColor: '#1B6CA8' }}
          >
            <div>
              <h2
                className="text-base text-white"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
              >
                How to Place an Order
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Simple steps — takes less than 2 minutes
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="px-5 py-3 space-y-1">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.25 }}
                className="flex items-center gap-3"
              >
                {/* Emoji circle */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0"
                  style={{ backgroundColor: '#EAF3FB' }}
                >
                  {step.emoji}
                </div>

                {/* Text */}
                <div className="py-2 flex-1">
                  <p
                    className="text-sm font-medium leading-tight"
                    style={{ color: '#1A2E42', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    <span
                      className="inline-block text-xs font-semibold mr-1.5 px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: '#1B6CA8', color: '#fff', fontFamily: 'Outfit, sans-serif' }}
                    >
                      {i + 1}
                    </span>
                    {step.title}
                  </p>
                  <p className="text-xs mt-0.5 inline-flex flex-wrap items-center gap-x-0.5" style={{ color: '#5A7A99' }}>
                    {step.description.includes('__MOMO__') ? (
                      <>
                        {step.description.split('__MOMO__')[0]}
                        <span className="inline-flex items-center gap-0.5">
                          <span className="text-sm font-semibold" style={{ color: '#1B6CA8' }}>{momoNumber}</span>
                          <CopyButton value={momoNumber} />
                        </span>
                        {step.description.split('__MOMO__')[1]}
                      </>
                    ) : step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ backgroundColor: '#F4F8FC', borderTop: '1px solid #C8DFF0' }}
          >
            <p className="text-xs" style={{ color: '#5A7A99' }}>
              💬 Questions? Chat with us on WhatsApp
            </p>
            <button
              onClick={() => setOpen(false)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{ backgroundColor: '#1B6CA8', color: '#fff', fontFamily: 'Outfit, sans-serif' }}
            >
              Got it!
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
