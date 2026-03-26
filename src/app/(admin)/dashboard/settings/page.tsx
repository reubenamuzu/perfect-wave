'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, KeyRound, Eye, EyeOff, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// ── Business Settings ──

const businessSchema = z.object({
  momoNumber: z.string().min(1, 'MoMo number is required'),
  whatsappNumber: z.string().min(1, 'WhatsApp number is required'),
})
type BusinessFormData = z.infer<typeof businessSchema>

function BusinessSettingsCard() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
  })

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.momoNumber) reset(data)
      })
      .catch(() => {/* keep empty */})
  }, [reset])

  async function onSubmit(data: BusinessFormData) {
    setLoading(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (res.ok) {
        toast.success('Business settings saved')
      } else {
        toast.error(json.error ?? 'Failed to save settings')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: '#EAF3FB' }}
        >
          <Settings2 className="w-5 h-5 text-[#1B6CA8]" />
        </div>
        <div>
          <h2
            className="text-xl font-semibold text-[#1A2E42]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Business Settings
          </h2>
          <p className="text-sm text-[#5A7A99]">Update your MoMo and WhatsApp contact numbers</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#C8DFF0]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="momoNumber">MoMo Payment Number</Label>
            <Input
              id="momoNumber"
              {...register('momoNumber')}
              placeholder="e.g. 0558373809"
              className="mt-1"
            />
            {errors.momoNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.momoNumber.message}</p>
            )}
            <p className="text-xs text-[#5A7A99] mt-1">
              Displayed in the order modal and "How to Order" guide
            </p>
          </div>

          <div>
            <Label htmlFor="whatsappNumber">WhatsApp Order Number</Label>
            <Input
              id="whatsappNumber"
              {...register('whatsappNumber')}
              placeholder="e.g. 233597473708 (international format)"
              className="mt-1"
            />
            {errors.whatsappNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.whatsappNumber.message}</p>
            )}
            <p className="text-xs text-[#5A7A99] mt-1">
              Use international format without + (e.g. 233XXXXXXXXX for Ghana)
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B6CA8] hover:bg-[#0D4F82] text-white gap-2 mt-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Settings
          </Button>
        </form>
      </div>
    </div>
  )
}

// ── Password ──

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type PasswordFormData = z.infer<typeof passwordSchema>

function PasswordInput({ id, placeholder, autoComplete, registration, error }: {
  id: string
  placeholder?: string
  autoComplete?: string
  registration: ReturnType<ReturnType<typeof useForm<PasswordFormData>>['register']>
  error?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <div className="relative mt-1">
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          {...registration}
          placeholder={placeholder}
          className="pr-10"
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A7A99] hover:text-[#1B6CA8] transition-colors"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

function ChangePasswordCard() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  async function onSubmit(data: PasswordFormData) {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      })
      const json = await res.json()
      if (res.ok) {
        toast.success('Password updated successfully')
        reset()
      } else {
        toast.error(json.error ?? 'Failed to update password')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: '#EAF3FB' }}
        >
          <KeyRound className="w-5 h-5 text-[#1B6CA8]" />
        </div>
        <div>
          <h2
            className="text-xl font-semibold text-[#1A2E42]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Change Password
          </h2>
          <p className="text-sm text-[#5A7A99]">Update your admin account password</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#C8DFF0]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <PasswordInput
              id="currentPassword"
              placeholder="••••••••"
              autoComplete="current-password"
              registration={register('currentPassword')}
              error={errors.currentPassword?.message}
            />
          </div>

          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <PasswordInput
              id="newPassword"
              placeholder="••••••••"
              autoComplete="new-password"
              registration={register('newPassword')}
              error={errors.newPassword?.message}
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="••••••••"
              autoComplete="new-password"
              registration={register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B6CA8] hover:bg-[#0D4F82] text-white gap-2 mt-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Update Password
          </Button>
        </form>
      </div>
    </>
  )
}

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-md">
      <BusinessSettingsCard />
      <ChangePasswordCard />
    </div>
  )
}
