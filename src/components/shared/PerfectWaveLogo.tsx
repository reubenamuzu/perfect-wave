import NextImage from 'next/image'

interface PerfectWaveLogoProps {
  size?: 'sm' | 'md' | 'lg'
}

const heights: Record<string, number> = {
  sm: 44,
  md: 54,
  lg: 68,
}

export default function PerfectWaveLogo({ size = 'md' }: PerfectWaveLogoProps) {
  return (
    <NextImage
      src="/recover-image-full.png"
      alt="PerfectWave Enterprise"
      width={0}
      height={0}
      sizes="100vw"
      style={{ height: heights[size], width: 'auto' }}
    />
  )
}
