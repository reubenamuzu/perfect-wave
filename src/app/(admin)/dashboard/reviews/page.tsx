'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ConfirmDeleteModal from '@/components/shared/ConfirmDeleteModal'
import StarRating from '@/components/shared/StarRating'
import { formatDate } from '@/lib/utils'
import type { IReview } from '@/types'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<IReview[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/reviews?admin=true')
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews ?? []))
  }, [])

  const filtered = reviews.filter((r) => {
    if (filter === 'pending') return !r.isApproved
    if (filter === 'approved') return r.isApproved
    return true
  })

  async function approve(id: string) {
    const res = await fetch(`/api/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isApproved: true }),
    })
    if (res.ok) {
      setReviews((prev) => prev.map((r) => (r._id === id ? { ...r, isApproved: true } : r)))
      toast.success('Review approved')
    }
  }

  async function confirmDelete() {
    if (!deleteId) return
    await fetch(`/api/reviews/${deleteId}`, { method: 'DELETE' })
    setReviews((prev) => prev.filter((r) => r._id !== deleteId))
    toast.success('Review deleted')
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-[#1A2E42]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Reviews</h1>
        <div className="flex gap-2">
          {(['pending', 'approved', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filter === f ? 'bg-[#1B6CA8] hover:bg-[#0D4F82] text-white' : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Customer', 'Rating', 'Comment', 'Type', 'Date', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-gray-400">No reviews found.</td></tr>
              ) : (
                filtered.map((review) => (
                  <tr key={review._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{review.customerName}</td>
                    <td className="py-3 px-4"><StarRating rating={review.rating} size={14} /></td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="truncate text-gray-600">{review.comment}</p>
                    </td>
                    <td className="py-3 px-4 capitalize text-gray-500">{review.productType}</td>
                    <td className="py-3 px-4 text-gray-400 text-xs whitespace-nowrap">{formatDate(review.createdAt)}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        review.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {review.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {!review.isApproved && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-green-600 hover:text-green-700"
                            onClick={() => approve(review._id)}
                            aria-label="Approve review"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-red-400 hover:text-red-600"
                          onClick={() => setDeleteId(review._id)}
                          aria-label="Delete review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete review?"
        description="This review will be permanently removed and can't be recovered."
      />
    </div>
  )
}
