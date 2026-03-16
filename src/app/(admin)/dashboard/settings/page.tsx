'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, KeyRound } from 'lucide-react'
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
            <Input
              id="currentPassword"
              type="password"
              {...register('currentPassword')}
              placeholder="••••••••"
              className="mt-1"
              autoComplete="current-password"
            />
            {errors.currentPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              {...register('newPassword')}
              placeholder="••••••••"
              className="mt-1"
              autoComplete="new-password"
            />
            {errors.newPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              placeholder="••••••••"
              className="mt-1"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
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
