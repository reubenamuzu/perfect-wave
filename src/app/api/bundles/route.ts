import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Bundle from '@/models/Bundle'

export async function GET() {
  try {
    await connectDB()
    const bundles = await Bundle.find({}).sort({ sortOrder: 1, sizeValue: 1 }).lean()
    return NextResponse.json({ bundles: JSON.parse(JSON.stringify(bundles)) })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bundles' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    await connectDB()
    const bundle = await Bundle.create(body)
    return NextResponse.json({ bundle: JSON.parse(JSON.stringify(bundle)) }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create bundle' }, { status: 500 })
  }
}
