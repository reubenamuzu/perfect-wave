import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Frame from '@/models/Frame'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    await connectDB()
    const frame = await Frame.findByIdAndUpdate(id, body, { new: true })
    if (!frame) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ frame: JSON.parse(JSON.stringify(frame)) })
  } catch {
    return NextResponse.json({ error: 'Failed to update frame' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await connectDB()
    await Frame.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete frame' }, { status: 500 })
  }
}
