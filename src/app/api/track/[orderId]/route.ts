import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Order from '@/models/Order'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    await connectDB()
    const order = await Order.findOne({ orderId: orderId.toUpperCase() })
      .select('orderId customerName status statusHistory orderType totalAmount items createdAt')
      .lean()

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order: JSON.parse(JSON.stringify(order)) })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to look up order' }, { status: 500 })
  }
}
