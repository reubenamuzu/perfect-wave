import mongoose, { Schema, Document } from 'mongoose'

export interface ReviewDocument extends Document {
  customerName: string
  rating: number
  comment: string
  productType: 'bundle' | 'frame' | 'general'
  isApproved: boolean
  createdAt: Date
}

const ReviewSchema = new Schema<ReviewDocument>(
  {
    customerName: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    productType: { type: String, enum: ['bundle', 'frame', 'general'], default: 'general' },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.models.Review || mongoose.model<ReviewDocument>('Review', ReviewSchema)
