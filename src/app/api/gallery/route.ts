import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import GalleryItem from '@/models/GalleryItem'

export async function GET() {
  try {
    await connectDB()
    const items = await GalleryItem.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 }).lean()
    return NextResponse.json({ items: JSON.parse(JSON.stringify(items)) })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    await connectDB()
    const item = await GalleryItem.create(body)
    return NextResponse.json({ item: JSON.parse(JSON.stringify(item)) }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 })
  }
}
