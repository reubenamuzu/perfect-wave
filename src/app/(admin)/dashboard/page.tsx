import type { Metadata } from 'next'
import { connectDB } from '@/lib/db'
import Order from '@/models/Order'
import Bundle from '@/models/Bundle'
import Frame from '@/models/Frame'
import DashboardClient from './DashboardClient'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function DashboardPage() {
  let stats = { totalOrders: 0, pendingOrders: 0, totalRevenue: 0, totalProducts: 0 }
  let recentOrders: unknown[] = []
  let chartData: unknown[] = []

  try {
    await connectDB()
    const [orders, bundleCount, frameCount] = await Promise.all([
      Order.find({}).sort({ createdAt: -1 }).limit(100).lean(),
      Bundle.countDocuments({ isActive: true }),
      Frame.countDocuments({ isActive: true }),
    ])

    stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.status === 'pending').length,
      totalRevenue: orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.totalAmount, 0),
      totalProducts: bundleCount + frameCount,
    }

    recentOrders = JSON.parse(JSON.stringify(orders.slice(0, 5)))

    // Chart data: orders per day (last 14 days)
    const now = new Date()
    chartData = Array.from({ length: 14 }).map((_, i) => {
      const d = new Date(now)
      d.setDate(d.getDate() - (13 - i))
      const label = `${d.getMonth() + 1}/${d.getDate()}`
      const count = orders.filter((o) => {
        const c = new Date(o.createdAt)
        return c.toDateString() === d.toDateString()
      }).length
      return { date: label, orders: count }
    })
  } catch {
    // DB not connected
  }

  return (
    <DashboardClient
      stats={stats}
      recentOrders={JSON.parse(JSON.stringify(recentOrders))}
      chartData={JSON.parse(JSON.stringify(chartData))}
    />
  )
}
