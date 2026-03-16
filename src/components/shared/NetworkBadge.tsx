import { NETWORKS } from '@/lib/networkConfig'
import type { NetworkId } from '@/types'

interface NetworkBadgeProps {
  network: NetworkId
  size?: 'sm' | 'md' | 'lg'
}

export default function NetworkBadge({ network, size = 'md' }: NetworkBadgeProps) {
  const config = NETWORKS[network]
  const sizes = { sm: 'w-7 h-7 text-[9px]', md: 'w-10 h-10 text-xs', lg: 'w-14 h-14 text-sm' }

  if (network === 'airteltigo') {
    return (
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center font-bold overflow-hidden relative`}
        aria-label={config.label}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${config.primaryColor} 50%, ${config.secondaryColor} 50%)`,
          }}
        />
        <span className="relative z-10 font-bold text-white drop-shadow">{config.abbr}</span>
      </div>
    )
  }

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold`}
      style={{ backgroundColor: config.primaryColor, color: config.textColor }}
      aria-label={config.label}
    >
      <span className="font-bold">{config.abbr}</span>
    </div>
  )
}
