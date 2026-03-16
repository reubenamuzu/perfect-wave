import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import GalleryItem from '@/models/GalleryItem'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await connectDB()
    await GalleryItem.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 })
  }
}
