export type NetworkId = 'mtn' | 'telecel' | 'airteltigo';
export type OrderStatus = 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';
export type OrderType = 'bundle' | 'frame';
export type PaymentMethod = 'momo_before' | 'cash_on_delivery';
export type ProductType = 'bundle' | 'frame' | 'general';
export type GalleryCategory = 'frames' | 'custom' | 'showcase';
export type FrameMaterial = 'Wood' | 'Plastic' | 'Metal';

export interface IBundle {
  _id: string;
  network: NetworkId;
  size: string;
  sizeValue: number;
  price: number | null;
  validity: string;
  badge?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface IFrame {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  sizes: string[];
  material: FrameMaterial;
  color: string;
  badge?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface IGalleryItem {
  _id: string;
  imageUrl: string;
  title: string;
  description: string;
  caption: string;
  category: GalleryCategory;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface IReview {
  _id: string;
  customerName: string;
  rating: number;
  comment: string;
  productType: ProductType;
  isApproved: boolean;
  createdAt: string;
}

export interface IOrderItem {
  productId: string;
  productName: string;
  network?: string;
  size?: string;
  price: number;
  quantity: number;
  uploadedImageUrl?: string;
  frameStyle?: string;
}

export interface IStatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface IOrder {
  _id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: OrderType;
  items: IOrderItem[];
  totalAmount: number;
  // Payment
  paymentMethod: PaymentMethod;
  momoNumber?: string;
  paymentConfirmed: boolean;
  paymentConfirmedAt?: string;
  // Fulfilment
  bundlePhone?: string;
  deliveryAddress?: string;
  note?: string;
  status: OrderStatus;
  statusHistory: IStatusHistoryEntry[];
  smsSent: boolean;
  createdAt: string;
}

export interface IAdmin {
  _id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface NetworkConfig {
  id: NetworkId;
  label: string;
  abbr: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalProducts: number;
}
