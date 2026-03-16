'use client'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { ShoppingBag, Clock, DollarSign, Package } from 'lucide-react'
import { formatPrice, formatDateTime } from '@/lib/utils'
import type { IOrder, DashboardStats } from '@/types'

interface Props {
  stats: DashboardStats
  recentOrders: IOrder[]
  chartData: { date: string; orders: number }[]
}

const STAT_CARDS = [
  { key: 'totalOrders', label: 'Total Orders', icon: ShoppingBag, color: '#1A1A2E' },
  { key: 'pendingOrders', label: 'Pending Orders', icon: Clock, color: '#F5A623' },
  { key: 'totalRevenue', label: 'Total Revenue', icon: DollarSign, color: '#00C896' },
  { key: 'totalProducts', label: 'Total Products', icon: Package, color: '#6366F1' },
]

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  ready: 'bg-[#00C896]/20 text-[#00C896]',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function DashboardClient({ stats, recentOrders, chartData }: Props) {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]" style={{ fontFamily: 'Syne, sans-serif' }}>
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm">Overview of your business</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, color }, i) => {
          const value = stats[key as keyof DashboardStats]
          const display = key === 'totalRevenue' ? formatPrice(value as number) : value
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-gray-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                {key === 'pendingOrders' && (value as number) > 0 && (
                  <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">
                    Needs attention
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-[#1A1A2E]" style={{ fontFamily: 'Syne, sans-serif' }}>
                {display}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{label}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-bold text-[#1A1A2E] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
          Orders (last 14 days)
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="orders" fill="#F5A623" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-bold text-[#1A1A2E] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
          Recent Orders
        </h2>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-mono text-xs font-medium text-[#1A1A2E]">{order.orderId}</td>
                    <td className="py-2.5 px-3">{order.customerName}</td>
                    <td className="py-2.5 px-3 font-semibold">{formatPrice(order.totalAmount)}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.status] ?? ''}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-400 text-xs">{formatDateTime(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-sm py-6 text-center">No orders yet.</p>
        )}
      </div>
    </div>
  )
}
