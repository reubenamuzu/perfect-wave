/**
 * Seed sample bundles and frames.
 * Usage: npx ts-node scripts/seed-data.ts
 */
import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || ''

const BundleSchema = new mongoose.Schema({
  network: String, size: String, sizeValue: Number, price: Number,
  validity: String, category: String, badge: String, isActive: Boolean, sortOrder: Number,
}, { timestamps: true })

const FrameSchema = new mongoose.Schema({
  name: String, description: String, imageUrl: String, price: Number,
  sizes: [String], material: String, color: String, badge: String, isActive: Boolean, sortOrder: Number,
}, { timestamps: true })

const Bundle = mongoose.models.Bundle || mongoose.model('Bundle', BundleSchema)
const Frame = mongoose.models.Frame || mongoose.model('Frame', FrameSchema)

// All networks share the same price structure per flyer
const BUNDLE_SIZES = [
  { size: '1GB',  sizeValue: 1,  price: 6,    validity: '1 day',   category: 'daily' },
  { size: '2GB',  sizeValue: 2,  price: 11,   validity: '2 days',  category: 'daily' },
  { size: '3GB',  sizeValue: 3,  price: 15,   validity: '7 days',  category: 'weekly' },
  { size: '4GB',  sizeValue: 4,  price: 19,   validity: '7 days',  category: 'weekly' },
  { size: '5GB',  sizeValue: 5,  price: 24,   validity: '7 days',  category: 'weekly',  badge: 'Popular' },
  { size: '10GB', sizeValue: 10, price: 45,   validity: '30 days', category: 'monthly', badge: 'Best value' },
  { size: '15GB', sizeValue: 15, price: 63,   validity: '30 days', category: 'monthly' },
  { size: '20GB', sizeValue: 20, price: 85,   validity: '30 days', category: 'monthly' },
  { size: '30GB', sizeValue: 30, price: null, validity: '30 days', category: 'monthly', badge: 'Call for price' },
]

const NETWORKS = ['mtn', 'telecel', 'airteltigo'] as const

const BUNDLES = NETWORKS.flatMap((network, nIdx) =>
  BUNDLE_SIZES.map((b, bIdx) => ({
    network,
    size: b.size,
    sizeValue: b.sizeValue,
    price: b.price,
    validity: b.validity,
    category: b.category,
    badge: b.badge ?? null,
    isActive: b.price !== null, // mark null-price as inactive until confirmed
    sortOrder: nIdx * 100 + bIdx + 1,
  }))
)

const FRAMES = [
  { name: 'Classic Gold', description: 'Elegant gold wood frame', imageUrl: '', price: 45, sizes: ['4x6', '5x7', '8x10', 'A4'], material: 'Wood', color: 'Gold', badge: 'Bestseller', isActive: true, sortOrder: 1 },
  { name: 'Modern Black', description: 'Sleek matte black plastic frame', imageUrl: '', price: 35, sizes: ['4x6', '5x7', '8x10'], material: 'Plastic', color: 'Black', isActive: true, sortOrder: 2 },
  { name: 'Silver Metal', description: 'Premium brushed silver frame', imageUrl: '', price: 65, sizes: ['5x7', '8x10', 'A4', '12x16'], material: 'Metal', color: 'Silver', badge: 'New arrival', isActive: true, sortOrder: 3 },
  { name: 'Natural Wood', description: 'Rustic natural wood finish', imageUrl: '', price: 50, sizes: ['4x6', '5x7', '8x10', 'A4', 'A3'], material: 'Wood', color: 'Brown', isActive: true, sortOrder: 4 },
]

async function main() {
  if (!MONGODB_URI) {
    console.error('❌  MONGODB_URI not set')
    process.exit(1)
  }

  await mongoose.connect(MONGODB_URI)
  console.log('✅  Connected to MongoDB')

  const bundleCount = await Bundle.countDocuments()
  if (bundleCount === 0) {
    await Bundle.insertMany(BUNDLES)
    console.log(`✅  Seeded ${BUNDLES.length} bundles (${NETWORKS.length} networks × ${BUNDLE_SIZES.length} sizes)`)
  } else {
    console.log(`ℹ️   Bundles already exist (${bundleCount}) — delete collection first to re-seed`)
  }

  const frameCount = await Frame.countDocuments()
  if (frameCount === 0) {
    await Frame.insertMany(FRAMES)
    console.log(`✅  Seeded ${FRAMES.length} frames`)
  } else {
    console.log(`ℹ️   Frames already exist (${frameCount})`)
  }

  process.exit(0)
}

main().catch((err) => { console.error('❌  Seed failed:', err); process.exit(1) })
