interface PerfectWaveLogoProps {
  variant?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: { svg: 28, textMain: 'text-base', textSub: 'text-[8px]', gap: 'gap-2' },
  md: { svg: 36, textMain: 'text-lg', textSub: 'text-[9px]', gap: 'gap-2.5' },
  lg: { svg: 48, textMain: 'text-2xl', textSub: 'text-xs', gap: 'gap-3' },
}

export default function PerfectWaveLogo({
  variant = 'dark',
  size = 'md',
}: PerfectWaveLogoProps) {
  const s = sizes[size]
  const textColor = variant === 'light' ? '#FFFFFF' : '#1A2E42'
  const subColor = variant === 'light' ? 'rgba(255,255,255,0.75)' : '#5A7A99'

  return (
    <div className={`flex items-center ${s.gap} select-none`}>
      {/* Wave SVG mark */}
      <svg
        width={s.svg}
        height={s.svg}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer arc — lightest blue */}
        <path
          d="M8 36 C8 20, 16 8, 24 8 C32 8, 40 20, 40 36"
          stroke="#7BB8E0"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Middle arc */}
        <path
          d="M12 36 C12 22, 18 12, 24 12 C30 12, 36 22, 36 36"
          stroke="#1B6CA8"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Inner arc — darkest */}
        <path
          d="M17 36 C17 25, 20 17, 24 17 C28 17, 31 25, 31 36"
          stroke="#0D4F82"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Base line */}
        <line x1="6" y1="37" x2="42" y2="37" stroke="#C8DFF0" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* Text */}
      <div className="flex flex-col leading-none">
        <span
          className={`${s.textMain} font-semibold tracking-tight`}
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: textColor }}
        >
          PerfectWave
        </span>
        <span
          className={`${s.textSub} font-normal tracking-[0.15em] uppercase mt-0.5`}
          style={{ fontFamily: 'Outfit, sans-serif', color: subColor }}
        >
          Services
        </span>
      </div>
    </div>
  )
}
