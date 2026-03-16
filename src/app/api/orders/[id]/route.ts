import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Order from '@/models/Order'
import { sendSMS, smsTemplates } from '@/lib/arkesel'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await connectDB()
    const order = await Order.findById(id).lean()
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ order: JSON.parse(JSON.stringify(order)) })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { status } = await req.json()

    await connectDB()
    const order = await Order.findById(id)
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    order.status = status
    order.statusHistory.push({ status, timestamp: new Date() })
    await order.save()

    // Send SMS notification
    if (['processing', 'ready', 'delivered', 'cancelled'].includes(status)) {
      const templateFn = smsTemplates[status as keyof typeof smsTemplates]
      if (templateFn) {
        const message = templateFn(order.customerName, order.orderId)
        await sendSMS(order.customerPhone, message)
        order.smsSent = true
        await order.save()
      }
    }

    return NextResponse.json({ order: JSON.parse(JSON.stringify(order)) })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await connectDB()
    await Order.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}
