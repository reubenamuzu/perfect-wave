'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, MessageCircle, Facebook, Instagram, Banknote, Bell, PhoneForwarded } from 'lucide-react'
import PageTransition from '@/components/shared/PageTransition'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { buildWhatsAppURL, generalInquiryMessage } from '@/lib/whatsapp'

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10, 'Enter a valid Ghana phone number'),
  email: z.string().email().optional().or(z.literal('')),
  subject: z.enum(['data_bundle', 'picture_frame', 'custom_order', 'other']),
  message: z.string().min(10),
})
type FormData = z.infer<typeof schema>

const SUBJECT_LABELS: Record<string, string> = {
  data_bundle: 'Data Bundle',
  picture_frame: 'Picture Frame',
  custom_order: 'Custom Order',
  other: 'Other',
}

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { subject: 'other' },
  })

  const subject = watch('subject')
  const name = watch('name')
  const message = watch('message')

  function onSubmit(data: FormData) {
    const text = generalInquiryMessage(data.name, SUBJECT_LABELS[data.subject], data.message)
    window.open(buildWhatsAppURL(text), '_blank')
    toast.success('Opening WhatsApp with your message!')
    reset()
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F4F8FC]">
        <div className="bg-[#0D4F82] py-14 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-semibold text-white mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Contact Us
            </h1>
            <p className="text-[#5A7A99]">We're here to help — reach out anytime</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* How to Pay */}
          <div className="mb-12">
            <p
              className="text-xs tracking-[0.18em] uppercase mb-1"
              style={{ color: '#5A7A99', fontFamily: 'Outfit, sans-serif' }}
            >
              Simple &amp; flexible
            </p>
            <h2
              className="text-2xl mb-6"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, color: '#1A2E42' }}
            >
              How to Pay
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: '#EAF3FB' }}
                >
                  <PhoneForwarded className="w-5 h-5" style={{ color: '#1B6CA8' }} />
                </div>
                <h3
                  className="text-sm mb-1.5"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, color: '#1A2E42' }}
                >
                  Send MoMo First
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Outfit, sans-serif', color: '#5A7A99', fontWeight: 400 }}>
                  Send your payment to 0597473708, share the screenshot on WhatsApp, and we&apos;ll
                  process your order right away.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: '#EAF3FB' }}
                >
                  <Bell className="w-5 h-5" style={{ color: '#1B6CA8' }} />
                </div>
                <h3
                  className="text-sm mb-1.5"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, color: '#1A2E42' }}
                >
                  Receive a MoMo Request
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Outfit, sans-serif', color: '#5A7A99', fontWeight: 400 }}>
                  Place your order on WhatsApp, and we&apos;ll send a MoMo payment request directly
                  to your phone to confirm.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl border border-[#C8DFF0] p-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: '#EAF3FB' }}
                >
                  <Banknote className="w-5 h-5" style={{ color: '#1B6CA8' }} />
                </div>
                <h3
                  className="text-sm mb-1.5"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, color: '#1A2E42' }}
                >
                  Cash on Delivery
                </h3>
                <p className="text-sm" style={{ fontFamily: 'Outfit, sans-serif', color: '#5A7A99', fontWeight: 400 }}>
                  Available for picture frame orders within the Kumasi area. Pay cash when your
                  order arrives at your location.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Info side */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                <h2 className="text-xl font-semibold text-[#1A1A2E]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Get in Touch
                </h2>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#1B6CA8] mt-0.5 shrink-0" />
                  <p className="text-gray-600">Kumasi, Ashanti Region, Ghana</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#1B6CA8] shrink-0" />
                  <a href="tel:+233597473708" className="text-gray-600 hover:text-[#1B6CA8]">0597 473 708</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#1B6CA8] shrink-0" />
                  <a href="mailto:info@perfectwave.gh" className="text-gray-600 hover:text-[#1B6CA8]">info@perfectwave.gh</a>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#1B6CA8] mt-0.5 shrink-0" />
                  <div className="text-gray-600 text-sm">
                    <p>Mon–Sat: 8am – 7pm</p>
                    <p>Sunday: 10am – 5pm</p>
                  </div>
                </div>
              </div>

              <a
                href={buildWhatsAppURL('Hello! I have a question.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#25D366] text-white rounded-xl p-4 font-medium hover:bg-[#20ba5a] transition-colors"
              >
                <MessageCircle className="w-6 h-6 fill-white" />
                <div>
                  <p>Chat on WhatsApp</p>
                  <p className="font-normal text-sm text-green-100">0597 473 708</p>
                </div>
              </a>

              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#1877F2] text-white rounded-xl px-4 py-3 font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  <Facebook className="w-5 h-5" /> Facebook
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white rounded-xl px-4 py-3 font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  <Instagram className="w-5 h-5" /> Instagram
                </a>
              </div>
            </motion.div>

            {/* Form side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8"
            >
              <h2 className="text-xl font-semibold text-[#1A1A2E] mb-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Send a Message
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" {...register('name')} placeholder="Your full name" className="mt-1" />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" {...register('phone')} placeholder="0597 473 708" className="mt-1" />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input id="email" type="email" {...register('email')} placeholder="your@email.com" className="mt-1" />
                </div>
                <div>
                  <Label>Subject *</Label>
                  <Select onValueChange={(v) => setValue('subject', v as FormData['subject'])} defaultValue="other">
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="data_bundle">Data Bundle</SelectItem>
                      <SelectItem value="picture_frame">Picture Frame</SelectItem>
                      <SelectItem value="custom_order">Custom Order</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" {...register('message')} placeholder="How can we help you?" className="mt-1 min-h-[100px]" />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                </div>
                <Button type="submit" className="w-full bg-[#1B6CA8] hover:bg-[#0D4F82] text-white gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Send via WhatsApp
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
