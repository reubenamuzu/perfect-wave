/**
 * Seed admin user into MongoDB.
 * Usage: npx ts-node --project tsconfig.json scripts/seed-admin.ts
 *
 * Or via node with ts-node/register:
 *   node -r ts-node/register scripts/seed-admin.ts
 */
import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI || ''
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@perfectwave.gh'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@2024!'

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true })

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)

async function main() {
  if (!MONGODB_URI) {
    console.error('❌  MONGODB_URI is not set. Add it to your .env.local file.')
    process.exit(1)
  }

  await mongoose.connect(MONGODB_URI)
  console.log('✅  Connected to MongoDB')

  const existing = await Admin.findOne({ email: ADMIN_EMAIL })
  if (existing) {
    console.log(`ℹ️   Admin already exists: ${ADMIN_EMAIL}`)
    process.exit(0)
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12)
  await Admin.create({ email: ADMIN_EMAIL, passwordHash })

  console.log(`✅  Admin user created: ${ADMIN_EMAIL}`)
  console.log(`    Password: ${ADMIN_PASSWORD}`)
  console.log('    ⚠️  Change this password after first login!')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌  Seed failed:', err)
  process.exit(1)
})
