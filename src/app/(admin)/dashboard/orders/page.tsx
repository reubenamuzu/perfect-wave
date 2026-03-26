'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Search, Eye, Download, CheckCircle2, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatPrice, formatDateTime, getCloudinaryDownloadUrl } from '@/lib/utils'
import CopyButton from '@/components/shared/CopyButton'
import type { IOrder, OrderStatus } from '@/types'

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'processing', 'ready', 'delivered', 'cancelled']

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  ready:      'bg-teal-100 text-teal-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
}

const PAYMENT_BADGES: Record<string, { label: string; bg: string; color: string }> = {
  momo_before:      { label: 'MoMo First', bg: '#EAF3FB', color: '#1B6CA8' },
  cash_on_delivery: { label: 'Cash/COD',   bg: '#F1F5F9', color: '#475569' },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all')
  const [selected, setSelected] = useState<IOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase()
    const matchSearch = !q || o.orderId.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  async function updateStatus(orderId: string, status: OrderStatus) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)))
        toast.success(`Status updated to ${status}`)
      }
    } catch {
      toast.error('Failed to update status')
    }
  }

  async function confirmPayment(order: IOrder) {
    setConfirmingId(order._id)
    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentConfirmed: true }),
      })
      if (res.ok) {
        const { order: updated } = await res.json()
        setOrders((prev) => prev.map((o) => (o._id === order._id ? { ...o, ...updated } : o)))
        if (selected?._id === order._id) setSelected((s) => s ? { ...s, ...updated } : s)
        toast.success('Payment confirmed')
      }
    } catch {
      toast.error('Failed to confirm payment')
    } finally {
      setConfirmingId(null)
    }
  }

  function exportCSV() {
    const rows = [
      ['Order ID', 'Customer', 'Phone', 'Type', 'Payment', 'Amount', 'Status', 'Date'],
      ...filtered.map((o) => [
        o.orderId, o.customerName, o.customerPhone, o.orderType,
        o.paymentMethod ?? '', o.totalAmount, o.status, o.createdAt,
      ]),
    ]
    const csv = rows.map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'orders.csv'; a.click()
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl text-[#1A2E42]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
          >
            Orders
          </h1>
          <p className="text-sm text-[#5A7A99]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {filtered.length} order{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="outline" onClick={exportCSV} className="gap-2 text-sm border-[#C8DFF0] text-[#5A7A99]">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A7A99]" />
          <Input
            placeholder="Search order ID or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-[#C8DFF0]"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="w-40 border-[#C8DFF0]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#C8DFF0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#EAF3FB] bg-[#F4F8FC]">
                {['Order ID', 'Customer', 'Type', 'Payment', 'Paid', 'Amount', 'Status', 'Date', ''].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-4 text-xs uppercase tracking-wide whitespace-nowrap"
                    style={{ color: '#5A7A99', fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="py-10 text-center text-[#5A7A99]">Loading orders…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="py-10 text-center text-[#5A7A99]">No orders found.</td></tr>
              ) : (
                filtered.map((order) => {
                  const pmBadge = PAYMENT_BADGES[order.paymentMethod ?? '']
                  return (
                    <tr key={order._id} className="border-b border-[#F4F8FC] hover:bg-[#F4F8FC] transition-colors">
                      <td className="py-3 px-4 font-mono text-xs font-medium text-[#1B6CA8]">
                        <span className="inline-flex items-center gap-1">
                          {order.orderId}
                          <CopyButton value={order.orderId} />
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#1A2E42]">{order.customerName}</div>
                        <div className="inline-flex items-center gap-1 text-xs text-[#5A7A99]">
                          {order.customerPhone}
                          <CopyButton value={order.customerPhone} />
                        </div>
                      </td>
                      <td className="py-3 px-4 capitalize text-[#5A7A99]">{order.orderType}</td>
                      <td className="py-3 px-4">
                        {pmBadge ? (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                            style={{ backgroundColor: pmBadge.bg, color: pmBadge.color }}
                          >
                            {pmBadge.label}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => !order.paymentConfirmed && confirmPayment(order)}
                          disabled={order.paymentConfirmed || confirmingId === order._id}
                          aria-label={order.paymentConfirmed ? 'Payment confirmed' : 'Mark payment received'}
                          title={order.paymentConfirmed ? 'Payment confirmed' : 'Mark payment received'}
                          className="flex items-center"
                        >
                          {order.paymentConfirmed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-amber-400 hover:text-amber-600 transition-colors" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 font-medium text-[#1A2E42]">{formatPrice(order.totalAmount)}</td>
                      <td className="py-3 px-4">
                        <Select
                          value={order.status}
                          onValueChange={(v) => updateStatus(order._id, v as OrderStatus)}
                        >
                          <SelectTrigger className={`h-7 text-xs font-medium w-32 ${STATUS_COLORS[order.status] ?? ''}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((s) => (
                              <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4 text-xs whitespace-nowrap" style={{ color: '#5A7A99' }}>
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-[#5A7A99] hover:text-[#1B6CA8]"
                          onClick={() => setSelected(order)}
                          aria-label="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle
              className="font-mono text-[#1B6CA8] inline-flex items-center gap-1"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              {selected?.orderId}
              {selected && <CopyButton value={selected.orderId} />}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              {/* Customer */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[#5A7A99] mb-0.5">Customer</p>
                  <p className="font-medium text-[#1A2E42]">{selected.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-[#5A7A99] mb-0.5">Phone</p>
                  <p className="font-medium text-[#1A2E42] inline-flex items-center gap-1">
                    {selected.customerPhone}
                    <CopyButton value={selected.customerPhone} />
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#5A7A99] mb-0.5">Order type</p>
                  <p className="font-medium capitalize text-[#1A2E42]">{selected.orderType}</p>
                </div>
                <div>
                  <p className="text-xs text-[#5A7A99] mb-0.5">Total</p>
                  <p className="font-medium text-[#1A2E42]">{formatPrice(selected.totalAmount)}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs text-[#5A7A99] mb-1.5">Items</p>
                <ul className="space-y-1">
                  {selected.items.map((item, i) => (
                    <li key={i} className="flex justify-between rounded-lg px-3 py-2" style={{ backgroundColor: '#F4F8FC' }}>
                      <span className="text-[#1A2E42]">{item.productName}{item.size ? ` (${item.size})` : ''}</span>
                      <span className="font-medium text-[#1B6CA8]">{formatPrice(item.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customer photo — frame orders only */}
              {selected.items.some((item) => item.uploadedImageUrl) && (
                <div>
                  <p className="text-xs text-[#5A7A99] mb-1.5">Customer's uploaded photo</p>
                  {selected.items.filter((item) => item.uploadedImageUrl).map((item, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-[#C8DFF0]">
                      <img
                        src={item.uploadedImageUrl}
                        alt="Customer uploaded frame photo"
                        className="w-full object-cover max-h-64"
                      />
                      <div className="px-3 py-2 bg-[#F4F8FC] flex items-center justify-between">
                        <span className="text-xs text-[#5A7A99]">{item.productName}</span>
                        <a
                          href={getCloudinaryDownloadUrl(item.uploadedImageUrl!)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg text-white transition-colors"
                          style={{ backgroundColor: '#1B6CA8' }}
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download Full Quality
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Payment section */}
              <div
                className="rounded-xl p-4 space-y-3"
                style={{ backgroundColor: '#F4F8FC', border: '1px solid #C8DFF0' }}
              >
                <p
                  className="text-xs uppercase tracking-widest"
                  style={{ color: '#5A7A99', fontFamily: 'Outfit, sans-serif' }}
                >
                  Payment
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5A7A99]">Method</span>
                  {(() => {
                    const b = PAYMENT_BADGES[selected.paymentMethod ?? '']
                    return b ? (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: b.bg, color: b.color }}
                      >
                        {b.label}
                      </span>
                    ) : <span className="text-[#5A7A99]">—</span>
                  })()}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5A7A99]">Status</span>
                  {selected.paymentConfirmed ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                    </span>
                  ) : (
                    <span className="text-xs text-amber-600">Awaiting payment</span>
                  )}
                </div>

                {selected.paymentMethod === 'momo_before' && selected.momoNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#5A7A99]">MoMo from</span>
                    <span className="text-xs font-medium text-[#1A2E42]">{selected.momoNumber}</span>
                  </div>
                )}

                {!selected.paymentConfirmed && (
                  <Button
                    onClick={() => confirmPayment(selected)}
                    disabled={confirmingId === selected._id}
                    className="w-full mt-1 bg-[#1B6CA8] hover:bg-[#0D4F82] text-white text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as payment received
                  </Button>
                )}
              </div>

              {/* Fulfilment */}
              {(selected.bundlePhone || selected.deliveryAddress) && (
                <div className="space-y-2">
                  {selected.bundlePhone && (
                    <div>
                      <p className="text-xs text-[#5A7A99] mb-0.5">Bundle delivery number</p>
                      <p className="font-medium text-[#1A2E42] inline-flex items-center gap-1">
                        {selected.bundlePhone}
                        <CopyButton value={selected.bundlePhone} />
                      </p>
                    </div>
                  )}
                  {selected.deliveryAddress && (
                    <div>
                      <p className="text-xs text-[#5A7A99] mb-0.5">Delivery address</p>
                      <p className="font-medium text-[#1A2E42]">{selected.deliveryAddress}</p>
                    </div>
                  )}
                </div>
              )}

              {selected.note && (
                <div>
                  <p className="text-xs text-[#5A7A99] mb-0.5">Note</p>
                  <p className="text-[#1A2E42]">{selected.note}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
