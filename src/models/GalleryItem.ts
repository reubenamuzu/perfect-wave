import mongoose, { Schema, Document } from 'mongoose'

export interface GalleryItemDocument extends Document {
  imageUrl: string
  title: string
  description: string
  caption: string
  category: 'frames' | 'custom' | 'showcase'
  sortOrder: number
  isActive: boolean
  createdAt: Date
}

const GalleryItemSchema = new Schema<GalleryItemDocument>(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    caption: { type: String, default: '' },
    category: { type: String, enum: ['frames', 'custom', 'showcase'], default: 'showcase' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.models.GalleryItem ||
  mongoose.model<GalleryItemDocument>('GalleryItem', GalleryItemSchema)
