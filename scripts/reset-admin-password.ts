/**
 * Resets the admin password to a new value.
 * Usage: npx tsx scripts/reset-admin-password.ts
 */
import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI || ''
const NEW_PASSWORD = 'Admin@2024!'

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true })

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)

async function main() {
  if (!MONGODB_URI) {
    console.error('❌  MONGODB_URI not set.')
    process.exit(1)
  }

  await mongoose.connect(MONGODB_URI)
  console.log('✅  Connected to MongoDB')

  const admin = await Admin.findOne({})
  if (!admin) {
    console.error('❌  No admin found. Run seed-admin.ts first.')
    process.exit(1)
  }

  admin.passwordHash = await bcrypt.hash(NEW_PASSWORD, 12)
  await admin.save()

  console.log(`✅  Password reset for: ${admin.email}`)
  console.log(`    New password: ${NEW_PASSWORD}`)
  process.exit(0)
}

main().catch((err) => {
  console.error('❌  Reset failed:', err)
  process.exit(1)
})
