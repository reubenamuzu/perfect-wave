import mongoose, { Schema, Document } from 'mongoose'

export interface BundleDocument extends Document {
  network: 'mtn' | 'telecel' | 'airteltigo'
  size: string
  sizeValue: number
  price: number | null
  validity: string
  badge?: string
  isActive: boolean
  sortOrder: number
}

const BundleSchema = new Schema<BundleDocument>(
  {
    network: { type: String, enum: ['mtn', 'telecel', 'airteltigo'], required: true },
    size: { type: String, required: true },
    sizeValue: { type: Number, required: true },
    price: { type: Number, default: null },
    validity: { type: String, required: true },
    badge: { type: String },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.models.Bundle || mongoose.model<BundleDocument>('Bundle', BundleSchema)
