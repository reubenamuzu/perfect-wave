import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Review from '@/models/Review'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    await connectDB()
    const review = await Review.findByIdAndUpdate(id, body, { new: true })
    if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ review: JSON.parse(JSON.stringify(review)) })
  } catch {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await connectDB()
    await Review.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}
