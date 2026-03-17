'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, KeyRound, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

function PasswordInput({ id, placeholder, autoComplete, registration, error }: {
  id: string
  placeholder?: string
  autoComplete?: string
  registration: ReturnType<ReturnType<typeof useForm<FormData>>['register']>
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

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
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
    <div className="p-6 max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: '#EAF3FB' }}
        >
          <KeyRound className="w-5 h-5 text-[#1B6CA8]" />
        </div>
        <div>
          <h1
            className="text-xl font-semibold text-[#1A2E42]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Change Password
          </h1>
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
    </div>
  )
}
