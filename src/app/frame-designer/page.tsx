import type { Metadata } from 'next'
import { connectDB } from '@/lib/db'
import Frame from '@/models/Frame'
import PageTransition from '@/components/shared/PageTransition'
import FrameDesignerLoader from '@/components/frame-designer/FrameDesignerLoader'
import type { IFrame } from '@/types'

export const metadata: Metadata = {
  title: 'Frame Designer — Design Your Custom Picture Frame',
  description: 'Upload your photo and design a custom picture frame. Choose your style, size, and order via WhatsApp.',
}

export default async function FrameDesignerPage({
  searchParams,
}: {
  searchParams: Promise<{ frame?: string }>
}) {
  const params = await searchParams
  let frames: IFrame[] = []

  try {
    await connectDB()
    const raw = await Frame.find({ isActive: true }).sort({ sortOrder: 1 }).lean()
    frames = JSON.parse(JSON.stringify(raw))
  } catch {
    // show empty state
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F4F8FC]">
        <div className="py-10 px-4 bg-[#F4F8FC]">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs tracking-widest uppercase text-[#1B6CA8] mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Custom Frames</p>
            <h1
              className="text-3xl sm:text-4xl font-bold text-[#1A2E42] mb-1"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Frame Designer
            </h1>
            <p className="text-[#5A7A99]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Upload your photo, pick a frame, and order in seconds.
            </p>
          </div>
        </div>
        <FrameDesignerLoader frames={frames} defaultFrameId={params.frame} />
      </div>
    </PageTransition>
  )
}
