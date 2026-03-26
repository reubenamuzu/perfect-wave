import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number | null): string {
  if (amount === null || amount === undefined) return 'Call for price'
  return `GH¢ ${amount.toFixed(2)}`
}

export function generateOrderId(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(1000 + Math.random() * 9000)
  return `DBH-${year}-${random}`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function getCloudinaryDownloadUrl(url: string): string {
  return url.replace(
    /\/image\/upload\/[^/]+\//,
    '/image/upload/fl_attachment,q_100/'
  )
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-GH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
