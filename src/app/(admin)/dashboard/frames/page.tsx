'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Frame } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ConfirmDeleteModal from '@/components/shared/ConfirmDeleteModal'
import ImageUpload from '@/components/shared/ImageUpload'
import { formatPrice } from '@/lib/utils'
import type { IFrame } from '@/types'

const FRAME_SIZES = ['4x6', '5x7', '8x10', 'A4', 'A3', '10x12', '12x16']

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  imageUrl: z.string().optional(),
  material: z.string().min(1),
  color: z.string().optional(),
  badge: z.string().optional(),
  isActive: z.boolean(),
  sizes: z.array(z.string()).min(1, 'Select at least one size'),
})
type FormData = z.infer<typeof schema>

export default function FramesPage() {
  const [frames, setFrames] = useState<IFrame[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<IFrame | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['4x6'])

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { material: 'Wood', sizes: ['4x6'], isActive: true },
  })

  useEffect(() => {
    fetch('/api/frames').then((r) => r.json()).then((d) => setFrames(d.frames ?? []))
  }, [])

  function openNew() {
    setEditing(null); setImageUrl(''); setSelectedSizes(['4x6'])
    reset({ material: 'Wood', sizes: ['4x6'], isActive: true })
    setOpen(true)
  }

  function openEdit(frame: IFrame) {
    setEditing(frame); setImageUrl(frame.imageUrl); setSelectedSizes(frame.sizes)
    reset({ ...frame, badge: frame.badge ?? '', description: frame.description ?? '' })
    setOpen(true)
  }

  function toggleSize(s: string) {
    const next = selectedSizes.includes(s) ? selectedSizes.filter((x) => x !== s) : [...selectedSizes, s]
    setSelectedSizes(next); setValue('sizes', next)
  }

  async function onSubmit(data: FormData) {
    try {
      const payload = { ...data, imageUrl, sizes: selectedSizes }
      const method = editing ? 'PATCH' : 'POST'
      const url = editing ? `/api/frames/${editing._id}` : '/api/frames'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const saved = await res.json()
        setFrames((prev) =>
          editing ? prev.map((f) => (f._id === editing._id ? saved.frame : f)) : [...prev, saved.frame]
        )
        setOpen(false)
        toast.success(editing ? 'Frame updated' : 'Frame created')
      }
    } catch {
      toast.error('Failed to save frame')
    }
  }

  async function confirmDelete() {
    if (!deleteId) return
    const res = await fetch(`/api/frames/${deleteId}`, { method: 'DELETE' })
    if (res.ok) { setFrames((prev) => prev.filter((f) => f._id !== deleteId)); toast.success('Frame deleted') }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-[#1A2E42]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Picture Frames</h1>
        <Button onClick={openNew} className="bg-[#1B6CA8] hover:bg-[#0D4F82] text-white gap-2">
          <Plus className="w-4 h-4" /> Add Frame
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {frames.map((frame) => (
          <div key={frame._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="relative h-44 bg-gray-100">
              {frame.imageUrl ? (
                <Image src={frame.imageUrl} alt={frame.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Frame className="w-10 h-10 text-gray-300" />
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="font-bold text-sm text-[#1A1A2E]">{frame.name}</p>
              <p className="text-xs text-gray-400">{frame.material} · {formatPrice(frame.price)}</p>
              <div className="flex gap-1 mt-2">
                <Button size="sm" variant="outline" className="h-7 text-xs flex-1" onClick={() => openEdit(frame)}>
                  <Pencil className="w-3 h-3 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400" onClick={() => setDeleteId(frame._id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {frames.length === 0 && <p className="text-gray-400 text-sm col-span-full py-10 text-center">No frames yet.</p>}
      </div>

      <ConfirmDeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete frame?"
        description="This frame will be permanently removed and can't be recovered."
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Frame' : 'Add Frame'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <Label>Frame Image</Label>
              <div className="mt-1">
                <ImageUpload value={imageUrl} onChange={setImageUrl} label="Upload frame image" />
              </div>
            </div>
            <div>
              <Label>Name</Label>
              <Input {...register('name')} placeholder="Classic Gold" className="mt-1" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea {...register('description')} placeholder="Optional description" className="mt-1" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Price (GH¢)</Label>
                <Input type="number" step="0.01" {...register('price', { valueAsNumber: true })} placeholder="45.00" className="mt-1" />
              </div>
              <div>
                <Label>Material</Label>
                <Select onValueChange={(v) => v && setValue('material', v)} defaultValue={(editing?.material as string | undefined) ?? 'Wood'}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wood">Wood</SelectItem>
                    <SelectItem value="Plastic">Plastic</SelectItem>
                    <SelectItem value="Metal">Metal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Sizes</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {FRAME_SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSize(s)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border-2 transition-colors ${
                      selectedSizes.includes(s) ? 'border-[#F5A623] bg-[#F5A623] text-[#1A1A2E]' : 'border-gray-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {errors.sizes && <p className="text-xs text-red-500 mt-1">{errors.sizes.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Color</Label>
                <Input {...register('color')} placeholder="Gold" className="mt-1" />
              </div>
              <div>
                <Label>Badge</Label>
                <Input {...register('badge')} placeholder="Bestseller" className="mt-1" />
              </div>
            </div>
            <Button type="submit" className="w-full bg-[#1B6CA8] hover:bg-[#0D4F82] text-white">
              {editing ? 'Update' : 'Create'} Frame
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
