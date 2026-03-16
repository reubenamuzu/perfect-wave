import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Frame from '@/models/Frame'

export async function GET() {
  try {
    await connectDB()
    const frames = await Frame.find({}).sort({ sortOrder: 1 }).lean()
    return NextResponse.json({ frames: JSON.parse(JSON.stringify(frames)) })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch frames' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    await connectDB()
    const frame = await Frame.create(body)
    return NextResponse.json({ frame: JSON.parse(JSON.stringify(frame)) }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create frame' }, { status: 500 })
  }
}
