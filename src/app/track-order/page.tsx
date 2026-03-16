'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, CheckCircle2, Circle, Clock } from 'lucide-react'
import PageTransition from '@/components/shared/PageTransition'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDateTime } from '@/lib/utils'
import type { IOrder, OrderStatus } from '@/types'

const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'pending', label: 'Order Received' },
  { key: 'processing', label: 'Processing' },
  { key: 'ready', label: 'Ready for Delivery' },
  { key: 'delivered', label: 'Delivered' },
]

const STATUS_INDEX: Record<OrderStatus, number> = {
  pending: 0,
  processing: 1,
  ready: 2,
  delivered: 3,
  cancelled: -1,
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<IOrder | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSearch() {
    if (!orderId.trim()) return
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const res = await fetch(`/api/track/${orderId.trim().toUpperCase()}`)
      if (res.ok) {
        const data = await res.json()
        setOrder(data.order)
      } else {
        setError('Order not found. Please check your Order ID.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentStep = order ? STATUS_INDEX[order.status] : -1

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F4F8FC]">
        <div className="bg-[#0D4F82] py-14 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-semibold text-white mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Track Your Order
            </h1>
            <p className="text-[#5A7A99]">Enter your order ID to see its status</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Search */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
            <div className="flex gap-3">
              <Input
                placeholder="e.g. DBH-2026-1234"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="text-base"
              />
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="bg-[#1B6CA8] hover:bg-[#e09315] text-[#1A1A2E] font-medium gap-2 shrink-0"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Searching...' : 'Track'}
              </Button>
            </div>
            {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
          </div>

          {/* Order result */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-6 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#1A1A2E]">{order.orderId}</h2>
                  <p className="text-sm text-gray-500">{order.customerName}</p>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize ${
                    order.status === 'delivered'
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-700'
                      : order.status === 'processing'
                      ? 'bg-blue-100 text-blue-700'
                      : order.status === 'ready'
                      ? 'bg-[#00C896]/20 text-[#00C896]'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {order.status === 'cancelled' ? (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg p-3">
                  This order has been cancelled. Please contact us for assistance.
                </p>
              ) : (
                <div className="space-y-4">
                  {STATUS_STEPS.map((step, i) => {
                    const isCompleted = i <= currentStep
                    const isCurrent = i === currentStep
                    const historyEntry = order.statusHistory?.find((h) => h.status === step.key)
                    return (
                      <div key={step.key} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isCompleted ? 'bg-[#1B6CA8]' : 'bg-gray-100'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-300" />
                            )}
                          </div>
                          {i < STATUS_STEPS.length - 1 && (
                            <div className={`w-0.5 h-8 mt-1 ${isCompleted && i < currentStep ? 'bg-[#1B6CA8]' : 'bg-gray-100'}`} />
                          )}
                        </div>
                        <div className="pt-1.5">
                          <p className={`text-sm font-medium ${isCompleted ? 'text-[#1A1A2E]' : 'text-[#5A7A99]'}`}>
                            {step.label}
                            {isCurrent && (
                              <span className="ml-2 text-[10px] font-medium bg-[#1B6CA8] text-[#1A1A2E] px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                          </p>
                          {historyEntry && (
                            <p className="text-xs text-[#5A7A99] mt-0.5">{formatDateTime(historyEntry.timestamp)}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
