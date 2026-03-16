import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Order from '@/models/Order'
import { generateOrderId } from '@/lib/utils'

export async function GET() {
  try {
    await connectDB()
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ orders: JSON.parse(JSON.stringify(orders)) })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerName, customerPhone, customerEmail, orderType, items } = body

    if (!customerName || !customerPhone || !orderType || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()
    const totalAmount = items.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0)
    const orderId = generateOrderId()

    const order = await Order.create({
      orderId,
      customerName,
      customerPhone,
      customerEmail,
      orderType,
      items,
      totalAmount,
      status: 'pending',
      statusHistory: [{ status: 'pending', timestamp: new Date() }],
    })

    return NextResponse.json({ order: JSON.parse(JSON.stringify(order)) }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
