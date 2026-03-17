import mongoose, { Schema, Document } from 'mongoose'

export interface OrderItemDocument {
  productId: mongoose.Types.ObjectId
  productName: string
  network?: string
  size?: string
  price: number
  quantity: number
  uploadedImageUrl?: string
  frameStyle?: string
}

export interface StatusHistoryDocument {
  status: string
  timestamp: Date
  note?: string
}

export interface OrderDocument extends Document {
  orderId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  orderType: 'bundle' | 'frame'
  items: OrderItemDocument[]
  totalAmount: number
  // Payment
  paymentMethod: 'momo_before' | 'momo_request' | 'cash_on_delivery'
  momoNumber?: string
  paymentConfirmed: boolean
  paymentConfirmedAt?: Date
  // Fulfilment
  bundlePhone?: string
  deliveryAddress?: string
  note?: string
  status: 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled'
  statusHistory: StatusHistoryDocument[]
  smsSent: boolean
  createdAt: Date
}

const OrderItemSchema = new Schema<OrderItemDocument>(
  {
    productId: { type: Schema.Types.ObjectId },
    productName: { type: String, required: true },
    network: { type: String },
    size: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    uploadedImageUrl: { type: String },
    frameStyle: { type: String },
  },
  { _id: false }
)

const StatusHistorySchema = new Schema<StatusHistoryDocument>(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String },
  },
  { _id: false }
)

const OrderSchema = new Schema<OrderDocument>(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String },
    orderType: { type: String, enum: ['bundle', 'frame'], required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    // Payment
    paymentMethod: {
      type: String,
      enum: ['momo_before', 'cash_on_delivery'],
      required: true,
    },
    momoNumber: { type: String },
    paymentConfirmed: { type: Boolean, default: false },
    paymentConfirmedAt: { type: Date },
    // Fulfilment
    bundlePhone: { type: String },
    deliveryAddress: { type: String },
    note: { type: String },
    status: {
      type: String,
      enum: ['pending', 'processing', 'ready', 'delivered', 'cancelled'],
      default: 'pending',
    },
    statusHistory: [StatusHistorySchema],
    smsSent: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.models.Order || mongoose.model<OrderDocument>('Order', OrderSchema)
