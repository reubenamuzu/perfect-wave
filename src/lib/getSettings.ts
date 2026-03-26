import { connectDB } from '@/lib/db'
import Settings from '@/models/Settings'

const DEFAULTS = {
  momoNumber: '0558373809',
  whatsappNumber: '233597473708',
}

export async function getSettings(): Promise<{ momoNumber: string; whatsappNumber: string }> {
  await connectDB()
  const doc = await Settings.findOne().lean()
  if (!doc) return DEFAULTS
  return {
    momoNumber: doc.momoNumber ?? DEFAULTS.momoNumber,
    whatsappNumber: doc.whatsappNumber ?? DEFAULTS.whatsappNumber,
  }
}
