import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Bundle from '@/models/Bundle'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    await connectDB()
    const bundle = await Bundle.findByIdAndUpdate(id, body, { new: true })
    if (!bundle) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ bundle: JSON.parse(JSON.stringify(bundle)) })
  } catch {
    return NextResponse.json({ error: 'Failed to update bundle' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await connectDB()
    await Bundle.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete bundle' }, { status: 500 })
  }
}
