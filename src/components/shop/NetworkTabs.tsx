'use client'
import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { NETWORKS, NETWORK_LIST } from '@/lib/networkConfig'
import BundleGrid from './BundleGrid'
import type { IBundle, NetworkId, BundleCategory } from '@/types'

interface NetworkTabsProps {
  bundles: IBundle[]
}

const NETWORK_FILTERS = [
  { id: 'all', label: 'All Networks', color: null },
  ...NETWORK_LIST.map((n) => ({ id: n.id, label: n.label, color: NETWORKS[n.id].primaryColor })),
]

const CATEGORY_FILTERS: { id: 'all' | BundleCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
]

export default function NetworkTabs({ bundles }: NetworkTabsProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<'all' | NetworkId>('all')
  const [selectedCategory, setSelectedCategory] = useState<'all' | BundleCategory>('all')

  const filtered = useMemo(() => {
    return bundles.filter((b) => {
      const netOk = selectedNetwork === 'all' || b.network === selectedNetwork
      const catOk = selectedCategory === 'all' || b.category === selectedCategory
      return netOk && catOk
    })
  }, [bundles, selectedNetwork, selectedCategory])

  return (
    <div className="space-y-6">
      {/* Network filter — pill style */}
      <div className="flex flex-wrap gap-2">
        {NETWORK_FILTERS.map((f) => {
          const isActive = selectedNetwork === f.id
          return (
            <button
              key={f.id}
              onClick={() => setSelectedNetwork(f.id as 'all' | NetworkId)}
              className={cn(
                'px-4 py-2 rounded-full text-sm transition-all duration-200 border',
                isActive
                  ? 'text-white border-transparent'
                  : 'bg-white text-[#5A7A99] border-[#C8DFF0] hover:border-[#1B6CA8] hover:text-[#1B6CA8]'
              )}
              style={
                isActive
                  ? {
                      backgroundColor: f.color ?? '#1B6CA8',
                      borderColor: f.color ?? '#1B6CA8',
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: 500,
                    }
                  : { fontFamily: 'Outfit, sans-serif', fontWeight: 400 }
              }
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Category sub-filter — underline style */}
      <div className="flex gap-6 border-b border-[#C8DFF0]">
        {CATEGORY_FILTERS.map((f) => {
          const isActive = selectedCategory === f.id
          return (
            <button
              key={f.id}
              onClick={() => setSelectedCategory(f.id)}
              className={cn(
                'pb-2.5 text-sm transition-all duration-200 border-b-2 -mb-px',
                isActive
                  ? 'border-[#1B6CA8] text-[#1B6CA8]'
                  : 'border-transparent text-[#5A7A99] hover:text-[#1B6CA8]'
              )}
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: isActive ? 500 : 400,
              }}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      <BundleGrid bundles={filtered} />
    </div>
  )
}
