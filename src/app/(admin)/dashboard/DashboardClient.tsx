'use client'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { ShoppingBag, Clock, DollarSign, Package } from 'lucide-react'
import { formatPrice, formatDateTime } from '@/lib/utils'
import CopyButton from '@/components/shared/CopyButton'
import type { IOrder, DashboardStats } from '@/types'

interface Props {
  stats: DashboardStats
  recentOrders: IOrder[]
  chartData: { date: string; orders: number }[]
}

const STAT_CARDS = [
  { key: 'totalOrders',   label: 'Total Orders',   icon: ShoppingBag, color: '#1B6CA8' },
  { key: 'pendingOrders', label: 'Pending Orders',  icon: Clock,       color: '#B8860B' },
  { key: 'totalRevenue',  label: 'Total Revenue',   icon: DollarSign,  color: '#0D7A5F' },
  { key: 'totalProducts', label: 'Total Products',  icon: Package,     color: '#6366F1' },
]

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  ready:      'bg-teal-100 text-teal-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
}

export default function DashboardClient({ stats, recentOrders, chartData }: Props) {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1
          className="text-2xl text-[#1A2E42]"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
        >
          Dashboard
        </h1>
        <p className="text-[#5A7A99] text-sm mt-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Overview of your business
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, color }, i) => {
          const value = stats[key as keyof DashboardStats]
          const display = key === 'totalRevenue' ? formatPrice(value as number) : value
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-[#C8DFF0] p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                {key === 'pendingOrders' && (value as number) > 0 && (
                  <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">
                    Needs attention
                  </span>
                )}
              </div>
              <div
                className="text-2xl text-[#1A2E42]"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
              >
                {display}
              </div>
              <p className="text-sm text-[#5A7A99] mt-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {label}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-[#C8DFF0] p-6">
        <h2
          className="text-base text-[#1A2E42] mb-4"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
        >
          Orders (last 14 days)
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EAF3FB" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#5A7A99' }} />
            <YAxis tick={{ fontSize: 11, fill: '#5A7A99' }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #C8DFF0', boxShadow: '0 4px 12px rgba(27,108,168,0.08)' }}
            />
            <Bar dataKey="orders" fill="#1B6CA8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-[#C8DFF0] p-6">
        <h2
          className="text-base text-[#1A2E42] mb-4"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}
        >
          Recent Orders
        </h2>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#EAF3FB]">
                  {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2 px-3 text-xs uppercase tracking-wide"
                      style={{ color: '#5A7A99', fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-[#F4F8FC] hover:bg-[#F4F8FC] transition-colors">
                    <td className="py-2.5 px-3 font-mono text-xs font-medium text-[#1B6CA8]">
                      <span className="inline-flex items-center gap-1">
                        {order.orderId}
                        <CopyButton value={order.orderId} />
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#1A2E42]">{order.customerName}</td>
                    <td className="py-2.5 px-3 font-medium text-[#1A2E42]">{formatPrice(order.totalAmount)}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.status] ?? ''}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-xs" style={{ color: '#5A7A99' }}>{formatDateTime(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[#5A7A99] text-sm py-6 text-center" style={{ fontFamily: 'Outfit, sans-serif' }}>
            No orders yet.
          </p>
        )}
      </div>
    </div>
  )
}
