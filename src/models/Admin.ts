import mongoose, { Schema, Document } from 'mongoose'

export interface AdminDocument extends Document {
  email: string
  passwordHash: string
  createdAt: Date
}

const AdminSchema = new Schema<AdminDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.models.Admin || mongoose.model<AdminDocument>('Admin', AdminSchema)
