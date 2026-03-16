'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { buildWhatsAppMessage, buildWhatsAppURL } from '@/lib/whatsapp'
import { formatPrice } from '@/lib/utils'

// ── Types ──

export interface OrderProduct {
  type: 'bundle' | 'frame'
  name: string
  price: number
  network?: string
  size?: string
  imageUrl?: string
}

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  product: OrderProduct
}

// ── Zod schema ──

const ghPhone = /^0[2357][0-9]{8}$/

const orderSchema = z
  .object({
    customerName: z.string().min(2, 'Enter your name'),
    customerPhone: z.string().regex(ghPhone, 'Enter a valid Ghana number (e.g. 0597473708)'),
    bundlePhone: z
      .string()
      .regex(ghPhone, 'Enter a valid Ghana number')
      .optional()
      .or(z.literal('')),
    deliveryAddress: z.string().min(5, 'Enter delivery address').optional().or(z.literal('')),
    paymentMethod: z.enum(['momo_before', 'momo_request', 'cash_on_delivery']),
    momoNumber: z
      .string()
      .regex(ghPhone, 'Enter a valid MoMo number')
      .optional()
      .or(z.literal('')),
    note: z.string().optional(),
  })
  .refine(
    (d) => !(d.paymentMethod === 'momo_before' && !d.momoNumber),
    { message: 'MoMo number is required', path: ['momoNumber'] }
  )
  .refine(
    (d) => !(d.paymentMethod === 'cash_on_delivery' && !d.deliveryAddress),
    { message: 'Delivery address is required', path: ['deliveryAddress'] }
  )

type FormValues = z.infer<typeof orderSchema>

// ── Payment option config ──

const PAYMENT_OPTIONS = [
  {
    id: 'momo_before' as const,
    title: 'MoMo Before Delivery',
    description: 'Send GH¢{price} to 0597473708 first, then share screenshot on WhatsApp',
  },
  {
    id: 'momo_request' as const,
    title: 'MoMo Request',
    description: "We'll send a MoMo request to your phone after you place the order",
  },
  {
    id: 'cash_on_delivery' as const,
    title: 'Cash on Delivery',
    description: 'Pay cash when your frame arrives (available in Kumasi area)',
    framesOnly: true,
  },
]

// ── Component ──

export default function OrderModal({ isOpen, onClose, product }: OrderModalProps) {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: { paymentMethod: 'momo_request' },
  })

  const paymentMethod = watch('paymentMethod')

  function handleClose() {
    onClose()
    // Reset after exit animation
    setTimeout(() => {
      reset()
      setStep('form')
      setOrderId('')
    }, 300)
  }

  async function onSubmit(data: FormValues) {
    setLoading(true)
    try {
      // Build items array for API
      const items = [
        {
          productName: product.name,
          network: product.network,
          size: product.size,
          price: product.price,
          quantity: 1,
        },
      ]

      const payload = {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        orderType: product.type,
        items,
        paymentMethod: data.paymentMethod,
        momoNumber: data.momoNumber || undefined,
        bundlePhone: data.bundlePhone || undefined,
        deliveryAddress: data.deliveryAddress || undefined,
        note: data.note || undefined,
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to create order')
      const { order } = await res.json()

      // Build WhatsApp message
      const msgData = {
        orderId: order.orderId,
        orderType: product.type,
        paymentMethod: data.paymentMethod,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        price: product.price,
        note: data.note,
        // Bundle
        network: product.network,
        size: product.size,
        bundlePhone: data.bundlePhone || undefined,
        // Frame
        frameName: product.type === 'frame' ? product.name : undefined,
        frameSize: product.size,
        imageUrl: product.imageUrl,
        deliveryAddress: data.deliveryAddress || undefined,
        momoNumber: data.momoNumber || undefined,
      }

      const message = buildWhatsAppMessage(msgData)
      window.open(buildWhatsAppURL(message), '_blank')

      setOrderId(order.orderId)
      setStep('success')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const visiblePaymentOptions = PAYMENT_OPTIONS.filter(
    (opt) => !opt.framesOnly || product.type === 'frame'
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="max-w-[430px] max-h-[90vh] p-0 gap-0 overflow-hidden rounded-2xl flex flex-col"
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {step === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col min-h-0 overflow-hidden"
            >
              <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
                <DialogTitle
                  className="text-lg"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, color: '#1A2E42' }}
                >
                  Order via WhatsApp
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 pt-4 space-y-4 overflow-y-auto flex-1">
                {/* Product summary bar */}
                <div
                  className="rounded-xl px-4 py-2.5 text-sm"
                  style={{ backgroundColor: '#EAF3FB', color: '#1B6CA8' }}
                >
                  <span style={{ fontWeight: 500 }}>{product.name}</span>
                  {product.price && (
                    <span style={{ color: '#5A7A99' }}> — {formatPrice(product.price)}</span>
                  )}
                </div>

                {/* Full name */}
                <div className="space-y-1">
                  <Label htmlFor="customerName" style={{ color: '#1A2E42', fontWeight: 500 }}>
                    Full name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="customerName"
                    {...register('customerName')}
                    placeholder="Your full name"
                    className="border-[#C8DFF0] focus-visible:ring-[#1B6CA8]"
                  />
                  {errors.customerName && (
                    <p className="text-xs text-red-500">{errors.customerName.message}</p>
                  )}
                </div>

                {/* Your phone */}
                <div className="space-y-1">
                  <Label htmlFor="customerPhone" style={{ color: '#1A2E42', fontWeight: 500 }}>
                    Your phone number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="customerPhone"
                    {...register('customerPhone')}
                    placeholder="e.g. 0597473708"
                    className="border-[#C8DFF0] focus-visible:ring-[#1B6CA8]"
                  />
                  {errors.customerPhone && (
                    <p className="text-xs text-red-500">{errors.customerPhone.message}</p>
                  )}
                </div>

                {/* Bundle phone — bundles only */}
                {product.type === 'bundle' && (
                  <div className="space-y-1">
                    <Label htmlFor="bundlePhone" style={{ color: '#1A2E42', fontWeight: 500 }}>
                      Number to receive bundle <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="bundlePhone"
                      {...register('bundlePhone')}
                      placeholder="Can be same or different number"
                      className="border-[#C8DFF0] focus-visible:ring-[#1B6CA8]"
                    />
                    <p className="text-xs" style={{ color: '#5A7A99' }}>
                      We will send the data directly to this number
                    </p>
                    {errors.bundlePhone && (
                      <p className="text-xs text-red-500">{errors.bundlePhone.message}</p>
                    )}
                  </div>
                )}

                {/* Payment method */}
                <div className="space-y-2">
                  <p className="text-sm" style={{ color: '#1A2E42', fontWeight: 500 }}>
                    How would you like to pay? <span className="text-red-500">*</span>
                  </p>
                  {visiblePaymentOptions.map((opt) => {
                    const isSelected = paymentMethod === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setValue('paymentMethod', opt.id, { shouldValidate: true })}
                        className={cn(
                          'w-full text-left rounded-xl border px-4 py-3 transition-all duration-150',
                          isSelected
                            ? 'border-[#1B6CA8] bg-[#EAF3FB]'
                            : 'border-[#C8DFF0] bg-white hover:bg-[#F4F8FC]'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                              isSelected ? 'border-[#1B6CA8]' : 'border-[#C8DFF0]'
                            )}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-[#1B6CA8]" />
                            )}
                          </div>
                          <div>
                            <p
                              className="text-sm leading-tight"
                              style={{
                                color: isSelected ? '#1A2E42' : '#5A7A99',
                                fontWeight: isSelected ? 500 : 400,
                              }}
                            >
                              {opt.title}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: '#5A7A99' }}>
                              {opt.description.replace('{price}', String(product.price))}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* MoMo number — conditional */}
                {paymentMethod === 'momo_before' && (
                  <div className="space-y-1">
                    <Label htmlFor="momoNumber" style={{ color: '#1A2E42', fontWeight: 500 }}>
                      Your MoMo number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="momoNumber"
                      {...register('momoNumber')}
                      placeholder="Number you'll send from"
                      className="border-[#C8DFF0] focus-visible:ring-[#1B6CA8]"
                    />
                    <p className="text-xs" style={{ color: '#5A7A99' }}>
                      So we can confirm your payment
                    </p>
                    {errors.momoNumber && (
                      <p className="text-xs text-red-500">{errors.momoNumber.message}</p>
                    )}
                  </div>
                )}

                {/* Delivery address — COD frames */}
                {paymentMethod === 'cash_on_delivery' && (
                  <div className="space-y-1">
                    <Label htmlFor="deliveryAddress" style={{ color: '#1A2E42', fontWeight: 500 }}>
                      Delivery address <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="deliveryAddress"
                      {...register('deliveryAddress')}
                      placeholder="Street, area, landmark..."
                      className="border-[#C8DFF0] focus-visible:ring-[#1B6CA8] min-h-[72px]"
                    />
                    {errors.deliveryAddress && (
                      <p className="text-xs text-red-500">{errors.deliveryAddress.message}</p>
                    )}
                  </div>
                )}

                {/* Note */}
                <div className="space-y-1">
                  <Label htmlFor="note" style={{ color: '#1A2E42', fontWeight: 500 }}>
                    Additional note{' '}
                    <span className="font-normal" style={{ color: '#5A7A99' }}>
                      (optional)
                    </span>
                  </Label>
                  <Textarea
                    id="note"
                    {...register('note')}
                    placeholder="Any special instructions?"
                    className="border-[#C8DFF0] focus-visible:ring-[#1B6CA8] min-h-[64px]"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 border-[#C8DFF0] text-[#5A7A99]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#1B6CA8] hover:bg-[#0D4F82] text-white"
                  >
                    {loading ? 'Placing order...' : 'Order via WhatsApp →'}
                  </Button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="px-6 py-10 flex flex-col items-center text-center"
            >
              {/* Animated checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                className="mb-5"
              >
                <CheckCircle2
                  className="w-16 h-16"
                  style={{ color: '#1B6CA8' }}
                  strokeWidth={1.5}
                />
              </motion.div>

              <h2
                className="text-xl mb-1"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, color: '#1A2E42' }}
              >
                Order sent successfully!
              </h2>

              <p className="text-sm mb-4" style={{ color: '#5A7A99' }}>
                WhatsApp has been opened with your order details.
              </p>

              <div
                className="rounded-xl px-5 py-3 mb-2 w-full"
                style={{ backgroundColor: '#EAF3FB' }}
              >
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#5A7A99' }}>
                  Order ID
                </p>
                <p
                  className="text-lg tracking-wide"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, color: '#1B6CA8' }}
                >
                  {orderId}
                </p>
              </div>

              <p className="text-xs mb-6" style={{ color: '#5A7A99' }}>
                Save your Order ID to track your order status
              </p>

              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-[#C8DFF0] text-[#5A7A99]"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleClose()
                    router.push('/track-order')
                  }}
                  className="flex-1 bg-[#1B6CA8] hover:bg-[#0D4F82] text-white"
                >
                  Track my order
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
