'use client'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyButtonProps {
  value: string
}

export default function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <span className="relative inline-flex items-center">
      <button
        onClick={handleCopy}
        className="p-1 rounded transition-colors hover:bg-[#C8DFF0]"
        style={{ color: copied ? undefined : '#1B6CA8' }}
        aria-label={copied ? 'Copied!' : `Copy ${value}`}
      >
        {copied
          ? <Check className="w-3.5 h-3.5 text-green-500" />
          : <Copy className="w-3.5 h-3.5" />
        }
      </button>
      {copied && (
        <span
          className="absolute -top-7 left-1/2 -translate-x-1/2 text-[11px] px-2 py-0.5 rounded-md whitespace-nowrap z-50 pointer-events-none"
          style={{ backgroundColor: '#1A2E42', color: '#fff', fontFamily: 'Outfit, sans-serif' }}
        >
          Copied!
        </span>
      )}
    </span>
  )
}
