'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import PageTransition from '@/components/shared/PageTransition'
import StarRating from '@/components/shared/StarRating'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate } from '@/lib/utils'
import type { IReview } from '@/types'

const schema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  rating: z.number().min(1, 'Please select a rating').max(5),
  productType: z.enum(['bundle', 'frame', 'general']),
  comment: z.string().min(20, 'Comment must be at least 20 characters'),
})
type FormData = z.infer<typeof schema>

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<IReview[]>([])
  const [filter, setFilter] = useState<'all' | number>('all')
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0, productType: 'general' },
  })
  const rating = watch('rating')

  useEffect(() => {
    fetch('/api/reviews')
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews ?? []))
      .catch(() => {})
  }, [])

  const filtered = filter === 'all' ? reviews : reviews.filter((r) => r.rating === filter)
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  async function onSubmit(data: FormData) {
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        toast.success('Review submitted! It will appear after approval.')
        reset()
      } else {
        toast.error('Failed to submit review. Please try again.')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F4F8FC]">
        <div className="bg-[#0D4F82] py-14 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-semibold text-white mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Customer Reviews
            </h1>
            <p className="text-[#5A7A99]">Real feedback from our customers</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          {/* Average rating */}
          {reviews.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center">
                <div className="text-6xl font-semibold text-[#1A1A2E]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {avgRating.toFixed(1)}
                </div>
                <StarRating rating={Math.round(avgRating)} size={20} />
                <p className="text-sm text-gray-500 mt-1">{reviews.length} reviews</p>
              </div>
              <div className="flex-1 w-full">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter((r) => r.rating === star).length
                  const pct = reviews.length ? (count / reviews.length) * 100 : 0
                  return (
                    <div key={star} className="flex items-center gap-3 mb-1.5">
                      <span className="text-xs text-gray-500 w-4">{star}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1B6CA8] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-[#5A7A99] w-6">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {(['all', 5, 4, 3] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                  filter === f
                    ? 'bg-[#1A1A2E] text-white border-[#1A1A2E]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {f === 'all' ? 'All Reviews' : `${f} Stars`}
              </button>
            ))}
          </div>

          {/* Reviews masonry */}
          {filtered.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
              {filtered.map((review, i) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="break-inside-avoid bg-white border border-gray-200 rounded-2xl p-5"
                >
                  <StarRating rating={review.rating} />
                  <p className="text-gray-600 mt-3 text-sm leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-medium text-sm text-[#1A1A2E]">{review.customerName}</span>
                    <span className="text-xs text-[#5A7A99]">{formatDate(review.createdAt)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-[#5A7A99]">No reviews yet. Be the first!</div>
          )}

          {/* Review form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 max-w-xl mx-auto">
            <h2 className="text-2xl font-semibold text-[#1A1A2E] mb-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Leave a Review
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Label htmlFor="customerName">Your Name *</Label>
                <Input id="customerName" {...register('customerName')} placeholder="e.g. Kofi Mensah" className="mt-1" />
                {errors.customerName && <p className="text-xs text-red-500 mt-1">{errors.customerName.message}</p>}
              </div>

              <div>
                <Label>Rating *</Label>
                <div className="mt-1">
                  <StarRating rating={rating} interactive onRate={(r) => setValue('rating', r)} size={28} />
                </div>
                {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating.message}</p>}
              </div>

              <div>
                <Label htmlFor="productType">Product Type</Label>
                <Select onValueChange={(v) => setValue('productType', v as FormData['productType'])} defaultValue="general">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bundle">Data Bundle</SelectItem>
                    <SelectItem value="frame">Picture Frame</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="comment">Your Review *</Label>
                <Textarea
                  id="comment"
                  {...register('comment')}
                  placeholder="Tell us about your experience..."
                  className="mt-1 min-h-[100px]"
                />
                {errors.comment && <p className="text-xs text-red-500 mt-1">{errors.comment.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1A1A2E] hover:bg-[#0d0d1a] text-white"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
