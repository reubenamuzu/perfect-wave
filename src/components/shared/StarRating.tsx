'use client'
import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  max?: number
  size?: number
  interactive?: boolean
  onRate?: (rating: number) => void
}

export default function StarRating({
  rating,
  max = 5,
  size = 16,
  interactive = false,
  onRate,
}: StarRatingProps) {
  return (
    <div className="flex gap-0.5" aria-label={`Rating: ${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={`${i < rating ? 'fill-[#F5A623] text-[#F5A623]' : 'fill-gray-200 text-gray-200'} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={() => interactive && onRate?.(i + 1)}
        />
      ))}
    </div>
  )
}
