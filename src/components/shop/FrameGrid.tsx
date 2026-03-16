'use client'
import { AnimatePresence, motion } from 'framer-motion'
import FrameCard from './FrameCard'
import type { IFrame } from '@/types'

export default function FrameGrid({ frames }: { frames: IFrame[] }) {
  if (frames.length === 0) {
    return <div className="py-16 text-center text-gray-400">No frames found for this filter.</div>
  }
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={frames.map((f) => f._id).join(',')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        {frames.map((frame, i) => (
          <FrameCard key={frame._id} frame={frame} index={i} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
