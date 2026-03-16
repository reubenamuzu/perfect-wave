'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Upload, ZoomIn, ZoomOut, RotateCcw, MessageCircle, Loader2, Frame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FramePicker from './FramePicker'
import { buildWhatsAppURL, frameOrderMessage } from '@/lib/whatsapp'
import { formatPrice } from '@/lib/utils'
import type { IFrame } from '@/types'

// Slider isn't in shadcn by default — use a simple range input fallback
function RangeSlider({
  value, min, max, step, onChange,
}: {
  value: number; min: number; max: number; step: number; onChange: (v: number) => void
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-[#F5A623]"
    />
  )
}

interface FrameDesignerProps {
  frames: IFrame[]
  defaultFrameId?: string
}

export default function FrameDesigner({ frames, defaultFrameId }: FrameDesignerProps) {
  const [selectedFrame, setSelectedFrame] = useState<IFrame | null>(
    frames.find((f) => f._id === defaultFrameId) ?? frames[0] ?? null
  )
  const [selectedSize, setSelectedSize] = useState<string>(
    selectedFrame?.sizes[0] ?? '4x6'
  )
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const price = selectedFrame ? selectedFrame.price : 0

  async function handlePhotoUpload(file: File) {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) setPhotoUrl(data.url)
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  async function handleOrder() {
    if (!selectedFrame) return
    setExporting(true)
    try {
      const waUrl = buildWhatsAppURL(
        frameOrderMessage(selectedFrame.name, selectedSize, price, photoUrl ?? undefined)
      )
      window.open(waUrl, '_blank')
    } finally {
      setExporting(false)
    }
  }

  const handleFrameSelect = (frame: IFrame) => {
    setSelectedFrame(frame)
    setSelectedSize(frame.sizes[0] ?? '4x6')
    setScale(1)
    setRotation(0)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Left: Controls */}
      <div className="space-y-6">
        {/* Step 1: Choose frame */}
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
            Step 1 — Choose a Frame
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 p-4 max-h-64 overflow-y-auto">
            {frames.length > 0 ? (
              <FramePicker frames={frames} selectedId={selectedFrame?._id} onSelect={handleFrameSelect} />
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">No frames available yet.</p>
            )}
          </div>
        </div>

        {/* Step 2: Upload photo */}
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
            Step 2 — Upload Your Photo
          </h2>
          <button
            onClick={() => photoInputRef.current?.click()}
            className="w-full h-28 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#F5A623] transition-colors"
            aria-label="Upload photo"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-[#F5A623]" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-500">Click to upload photo</span>
                <span className="text-xs text-gray-400">JPG, PNG, HEIC up to 10MB</span>
              </>
            )}
          </button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*,.heic"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
          />
        </div>

        {/* Step 3: Adjust */}
        {photoUrl && (
          <div>
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
              Step 3 — Adjust Photo
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <ZoomIn className="w-3 h-3" /> Scale
                  </span>
                  <span className="text-xs font-mono text-gray-400">{scale.toFixed(2)}x</span>
                </div>
                <RangeSlider value={scale} min={0.5} max={3} step={0.05} onChange={setScale} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> Rotation
                  </span>
                  <span className="text-xs font-mono text-gray-400">{rotation}°</span>
                </div>
                <RangeSlider value={rotation} min={-180} max={180} step={1} onChange={setRotation} />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Size */}
        {selectedFrame && (
          <div>
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
              Step 4 — Choose Size
            </h2>
            <div className="flex flex-wrap gap-2">
              {selectedFrame.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                    selectedSize === s
                      ? 'border-[#F5A623] bg-[#F5A623] text-[#1A1A2E]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        {selectedFrame && (
          <div className="bg-[#1A1A2E] rounded-xl p-4 flex items-center justify-between">
            <span className="text-gray-300 text-sm">
              {selectedFrame.name} · {selectedSize}
            </span>
            <span className="text-[#F5A623] font-semibold text-xl" style={{ fontFamily: 'Syne, sans-serif' }}>
              {formatPrice(price)}
            </span>
          </div>
        )}

        <Button
          className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-medium text-base gap-2 h-12"
          onClick={handleOrder}
          disabled={!selectedFrame || exporting}
        >
          {exporting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <MessageCircle className="w-5 h-5" />
          )}
          Order This Design
        </Button>
      </div>

      {/* Right: Canvas Preview */}
      <div className="sticky top-20">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">Preview</h2>
        <div
          ref={canvasRef}
          className="relative bg-gray-100 rounded-2xl overflow-hidden border border-gray-200"
          style={{ aspectRatio: '4/5' }}
        >
          {/* Photo layer */}
          {photoUrl && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ overflow: 'hidden' }}
            >
              <div
                style={{
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                  transformOrigin: 'center',
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                }}
              >
                <Image src={photoUrl} alt="Your photo" fill className="object-cover" />
              </div>
            </div>
          )}

          {/* Frame overlay */}
          {selectedFrame?.imageUrl ? (
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src={selectedFrame.imageUrl}
                alt={selectedFrame.name}
                fill
                className="object-contain"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
          ) : (
            <div className="absolute inset-4 border-8 border-[#1A1A2E]/20 rounded-lg pointer-events-none" />
          )}

          {/* Empty state */}
          {!photoUrl && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2">
              <Frame className="w-10 h-10" />
              <p className="text-sm">Upload a photo to preview</p>
            </div>
          )}
        </div>

        {selectedFrame && (
          <p className="text-center text-xs text-gray-400 mt-2">
            {selectedFrame.name} · {selectedSize} · {formatPrice(price)}
          </p>
        )}
      </div>
    </div>
  )
}
