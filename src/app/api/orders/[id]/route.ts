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
    const body = await req.json()
    const { status, paymentConfirmed } = body

    await connectDB()
    const order = await Order.findById(id)
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Handle payment confirmation toggle
    if (paymentConfirmed === true && !order.paymentConfirmed) {
      order.paymentConfirmed = true
      order.paymentConfirmedAt = new Date()

      // Auto-advance from pending → processing
      if (order.status === 'pending') {
        order.status = 'processing'
        order.statusHistory.push({
          status: 'processing',
          timestamp: new Date(),
          note: 'Payment confirmed',
        })
        // Send SMS for processing
        const templateFn = smsTemplates['processing' as keyof typeof smsTemplates]
        if (templateFn) {
          const message = templateFn(order.customerName, order.orderId)
          await sendSMS(order.customerPhone, message)
          order.smsSent = true
        }
      }
    }

    // Handle status update
    if (status && status !== order.status) {
      order.status = status
      order.statusHistory.push({ status, timestamp: new Date() })

      if (['processing', 'ready', 'delivered', 'cancelled'].includes(status)) {
        const templateFn = smsTemplates[status as keyof typeof smsTemplates]
        if (templateFn) {
          const message = templateFn(order.customerName, order.orderId)
          await sendSMS(order.customerPhone, message)
          order.smsSent = true
        }
      }
    }

    await order.save()
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
