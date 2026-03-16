'use client'
import dynamic from 'next/dynamic'
import type { IFrame } from '@/types'

const FrameDesigner = dynamic(
  () => import('@/components/frame-designer/FrameDesigner'),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 flex items-center justify-center text-gray-400">
        Loading designer...
      </div>
    ),
  }
)

interface Props {
  frames: IFrame[]
  defaultFrameId?: string
}

export default function FrameDesignerLoader({ frames, defaultFrameId }: Props) {
  return <FrameDesigner frames={frames} defaultFrameId={defaultFrameId} />
}
