'use client'
import Image from 'next/image'
import { Frame } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { IFrame } from '@/types'

interface FramePickerProps {
  frames: IFrame[]
  selectedId?: string
  onSelect: (frame: IFrame) => void
}

export default function FramePicker({ frames, selectedId, onSelect }: FramePickerProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {frames.map((frame) => (
        <button
          key={frame._id}
          onClick={() => onSelect(frame)}
          className={cn(
            'relative aspect-square rounded-lg overflow-hidden border-2 transition-all',
            selectedId === frame._id
              ? 'border-[#F5A623] ring-2 ring-[#F5A623]/40'
              : 'border-gray-200 hover:border-gray-400'
          )}
          aria-label={`Select ${frame.name}`}
        >
          {frame.imageUrl ? (
            <Image src={frame.imageUrl} alt={frame.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Frame className="w-5 h-5 text-gray-300" />
            </div>
          )}
          {selectedId === frame._id && (
            <div className="absolute inset-0 bg-[#F5A623]/20 flex items-center justify-center">
              <span className="w-5 h-5 rounded-full bg-[#F5A623] flex items-center justify-center text-[10px] text-white font-bold">
                ✓
              </span>
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
