'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import StarRating from '@/components/shared/StarRating'
import { formatDate } from '@/lib/utils'
import type { IReview } from '@/types'

interface TestimonialsPreviewProps {
  reviews: IReview[]
}

export default function TestimonialsPreview({ reviews }: TestimonialsPreviewProps) {
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
              Testimonials
            </p>
            <h2
              className="text-3xl text-[#1A2E42]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
            >
              What Customers Say
            </h2>
          </div>
          <Link
            href="/reviews"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm transition-all hover:gap-3 text-[#1B6CA8]"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
          >
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.slice(0, 3).map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl p-6"
              style={{
                background: '#ffffff',
                border: '1px solid #C8DFF0',
                boxShadow: '0 2px 12px rgba(27,108,168,0.06)',
              }}
            >
              <StarRating rating={review.rating} size={16} />
              <p
                className="text-[#5A7A99] mt-3 text-sm leading-relaxed line-clamp-4"
                style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
              >
                &ldquo;{review.comment}&rdquo;
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className="text-sm text-[#1A2E42]"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 500 }}
                >
                  {review.customerName}
                </span>
                <span
                  className="text-xs text-[#5A7A99]"
                  style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
                >
                  {formatDate(review.createdAt)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {reviews.length === 0 && (
          <p
            className="text-center text-[#5A7A99] py-10"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
          >
            Be the first to leave a review!
          </p>
        )}
      </div>
    </section>
  )
}
