'use client'
import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { NETWORKS, NETWORK_LIST } from '@/lib/networkConfig'
import BundleGrid from './BundleGrid'
import type { IBundle, NetworkId } from '@/types'

interface NetworkTabsProps {
  bundles: IBundle[]
}

const NETWORK_FILTERS = NETWORK_LIST.map((n) => ({
  id: n.id as NetworkId,
  label: n.label,
  color: NETWORKS[n.id].primaryColor,
}))

export default function NetworkTabs({ bundles }: NetworkTabsProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkId>(NETWORK_LIST[0].id as NetworkId)

  const filtered = useMemo(() => {
    return bundles.filter(
      (b) =>
        b.network === selectedNetwork &&
        b.category !== 'weekly' 
        // b.category !== 'hourly'
    )
  }, [bundles, selectedNetwork])

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Section heading */}
      <div>
        <p
          className="text-xs tracking-[0.18em] uppercase mb-1"
          style={{ color: '#5A7A99', fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}
        >
          Stay Connected 24/7
        </p>
        <h2
          className="text-2xl"
          style={{ color: '#1A2E42', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
        >
          Select Your Network
        </h2>
      </div>

      {/* Network filter — pill style */}
      <div className="flex flex-wrap gap-2">
        {NETWORK_FILTERS.map((f) => {
          const isActive = selectedNetwork === f.id
          return (
            <button
              key={f.id}
              onClick={() => setSelectedNetwork(f.id)}
              className={cn(
                'px-5 py-2 rounded-full text-sm transition-all duration-200 border-3',
                isActive
                  ? 'text-white border-transparent'
                  : 'bg-white text-[#5A7A99] border-[#C8DFF0] hover:border-[#1B6CA8] hover:text-[#1B6CA8]'
              )}
              style={
                isActive
                  ? {
                      backgroundColor: f.color,
                      borderColor: f.color,
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: 700,
                    }
                  : { fontFamily: 'Outfit, sans-serif', fontWeight: 400 }
              }
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Select bundle label */}
      <p
        className="text-[11px] tracking-[0.2em] uppercase"
        style={{ color: '#5A7A99', fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}
      >
        Select Bundle
      </p>

      <BundleGrid bundles={filtered} />
    </div>
  )
}
