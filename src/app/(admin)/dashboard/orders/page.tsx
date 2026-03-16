'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Search, Eye, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatPrice, formatDateTime } from '@/lib/utils'
import type { IOrder, OrderStatus } from '@/types'

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'processing', 'ready', 'delivered', 'cancelled']
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  ready: 'bg-[#00C896]/20 text-[#00C896]',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all')
  const [selected, setSelected] = useState<IOrder | null>(null)
  const [loading, setLoading] = useState(true)

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

  function exportCSV() {
    const rows = [
      ['Order ID', 'Customer', 'Phone', 'Type', 'Amount', 'Status', 'Date'],
      ...filtered.map((o) => [o.orderId, o.customerName, o.customerPhone, o.orderType, o.totalAmount, o.status, o.createdAt]),
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
          <h1 className="text-2xl font-bold text-[#1A1A2E]" style={{ fontFamily: 'Syne, sans-serif' }}>Orders</h1>
          <p className="text-sm text-gray-500">{filtered.length} orders</p>
        </div>
        <Button variant="outline" onClick={exportCSV} className="gap-2 text-sm">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search order ID or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="w-40">
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
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Order ID', 'Customer', 'Type', 'Amount', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="py-10 text-center text-gray-400">Loading orders...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-gray-400">No orders found.</td></tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-medium text-[#1A1A2E]">{order.orderId}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-xs text-gray-400">{order.customerPhone}</div>
                    </td>
                    <td className="py-3 px-4 capitalize">{order.orderType}</td>
                    <td className="py-3 px-4 font-semibold">{formatPrice(order.totalAmount)}</td>
                    <td className="py-3 px-4">
                      <Select
                        value={order.status}
                        onValueChange={(v) => updateStatus(order._id, v as OrderStatus)}
                      >
                        <SelectTrigger className={`h-7 text-xs font-semibold w-32 ${STATUS_COLORS[order.status] ?? ''}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs whitespace-nowrap">{formatDateTime(order.createdAt)}</td>
                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => setSelected(order)}
                        aria-label="View order details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order {selected?.orderId}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-gray-400">Customer</span><p className="font-medium">{selected.customerName}</p></div>
                <div><span className="text-gray-400">Phone</span><p className="font-medium">{selected.customerPhone}</p></div>
                <div><span className="text-gray-400">Type</span><p className="font-medium capitalize">{selected.orderType}</p></div>
                <div><span className="text-gray-400">Total</span><p className="font-bold text-[#1A1A2E]">{formatPrice(selected.totalAmount)}</p></div>
              </div>
              <div>
                <span className="text-gray-400">Items</span>
                <ul className="mt-1 space-y-1">
                  {selected.items.map((item, i) => (
                    <li key={i} className="flex justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <span>{item.productName}{item.size ? ` (${item.size})` : ''}</span>
                      <span className="font-semibold">{formatPrice(item.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
