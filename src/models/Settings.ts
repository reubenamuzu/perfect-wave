import mongoose, { Schema, Document } from 'mongoose'

export interface SettingsDocument extends Document {
  momoNumber: string
  whatsappNumber: string
}

const SettingsSchema = new Schema<SettingsDocument>({
  momoNumber: { type: String, required: true, default: '0558373809' },
  whatsappNumber: { type: String, required: true, default: '233597473708' },
})

export default mongoose.models.Settings ||
  mongoose.model<SettingsDocument>('Settings', SettingsSchema)
