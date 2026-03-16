'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import PageTransition from '@/components/shared/PageTransition'
import type { IGalleryItem, GalleryCategory } from '@/types'
import { useEffect } from 'react'

type FilterType = 'all' | GalleryCategory
const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'frames', label: 'Frames' },
  { id: 'custom', label: 'Custom Orders' },
  { id: 'showcase', label: 'Showcase' },
]

export default function GalleryPage() {
  const [items, setItems] = useState<IGalleryItem[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? []))
      .catch(() => {})
  }, [])

  const filtered = filter === 'all' ? items : items.filter((i) => i.category === filter)

  function prev() {
    if (lightbox === null) return
    setLightbox(lightbox === 0 ? filtered.length - 1 : lightbox - 1)
  }
  function next() {
    if (lightbox === null) return
    setLightbox(lightbox === filtered.length - 1 ? 0 : lightbox + 1)
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F4F8FC]">
        {/* Header */}
        <div className="bg-[#0D4F82] py-14 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-semibold text-white mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Gallery
            </h1>
            <p className="text-[#5A7A99]">See our work — frames, custom orders, and showcases</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${
                  filter === f.id
                    ? 'bg-[#1B6CA8] text-white border-[#1B6CA8]'
                    : 'bg-white text-gray-600 border-[#C8DFF0] hover:border-[#1B6CA8] hover:text-[#1B6CA8]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Masonry grid */}
          {filtered.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {filtered.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="relative break-inside-avoid rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => setLightbox(i)}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.caption || 'Gallery image'}
                    width={400}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                  {item.caption && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="text-white text-sm font-medium">{item.caption}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-[#5A7A99]">No gallery images yet.</div>
          )}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightbox !== null && filtered[lightbox] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setLightbox(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-4xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={filtered[lightbox].imageUrl}
                  alt={filtered[lightbox].caption || 'Gallery image'}
                  width={1200}
                  height={900}
                  className="max-h-[80vh] w-auto rounded-xl object-contain"
                />
                {filtered[lightbox].caption && (
                  <p className="text-center text-white text-sm mt-2">{filtered[lightbox].caption}</p>
                )}
                <button
                  onClick={() => setLightbox(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40"
                  aria-label="Close lightbox"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
