import mongoose, { Schema, Document } from 'mongoose'

export interface FrameDocument extends Document {
  name: string
  description: string
  imageUrl: string
  price: number
  sizes: string[]
  material: string
  color: string
  badge?: string
  isActive: boolean
  sortOrder: number
}

const FrameSchema = new Schema<FrameDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    sizes: [{ type: String }],
    material: { type: String, default: 'Wood' },
    color: { type: String, default: '' },
    badge: { type: String },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.models.Frame || mongoose.model<FrameDocument>('Frame', FrameSchema)
