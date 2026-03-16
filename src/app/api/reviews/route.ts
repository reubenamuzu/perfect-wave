import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Review from '@/models/Review'

export async function GET(req: NextRequest) {
  try {
    const isAdmin = req.nextUrl.searchParams.get('admin') === 'true'
    await connectDB()
    const filter = isAdmin ? {} : { isApproved: true }
    const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ reviews: JSON.parse(JSON.stringify(reviews)) })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerName, rating, comment, productType } = body

    if (!customerName || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()
    const review = await Review.create({
      customerName,
      rating,
      comment,
      productType: productType ?? 'general',
      isApproved: false,
    })

    return NextResponse.json({ review: JSON.parse(JSON.stringify(review)) }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
