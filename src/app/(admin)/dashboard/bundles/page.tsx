'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import NetworkBadge from '@/components/shared/NetworkBadge'
import { NETWORKS } from '@/lib/networkConfig'
import { formatPrice } from '@/lib/utils'
import type { IBundle, NetworkId, BundleCategory } from '@/types'

const schema = z.object({
  network: z.enum(['mtn', 'telecel', 'airteltigo']),
  size: z.string().min(1),
  sizeValue: z.number().positive(),
  price: z.number().positive(),
  validity: z.string().min(1),
  category: z.enum(['daily', 'weekly', 'monthly']),
  badge: z.string().optional(),
  isActive: z.boolean(),
})
type FormData = z.infer<typeof schema>

export default function BundlesPage() {
  const [bundles, setBundles] = useState<IBundle[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<IBundle | null>(null)

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { network: 'mtn', category: 'monthly', isActive: true },
  })

  useEffect(() => {
    fetch('/api/bundles').then((r) => r.json()).then((d) => setBundles(d.bundles ?? []))
  }, [])

  function openNew() {
    setEditing(null)
    reset({ network: 'mtn', category: 'monthly', isActive: true })
    setOpen(true)
  }

  function openEdit(bundle: IBundle) {
    setEditing(bundle)
    reset({ ...bundle, badge: bundle.badge ?? '' })
    setOpen(true)
  }

  async function onSubmit(data: FormData) {
    try {
      const payload = { ...data, sizeValue: Number(data.sizeValue), price: Number(data.price) }
      const method = editing ? 'PATCH' : 'POST'
      const url = editing ? `/api/bundles/${editing._id}` : '/api/bundles'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const saved = await res.json()
        setBundles((prev) =>
          editing
            ? prev.map((b) => (b._id === editing._id ? saved.bundle : b))
            : [...prev, saved.bundle]
        )
        setOpen(false)
        toast.success(editing ? 'Bundle updated' : 'Bundle created')
      }
    } catch {
      toast.error('Failed to save bundle')
    }
  }

  async function deleteBundle(id: string) {
    if (!confirm('Delete this bundle?')) return
    const res = await fetch(`/api/bundles/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setBundles((prev) => prev.filter((b) => b._id !== id))
      toast.success('Bundle deleted')
    }
  }

  const grouped = ['mtn', 'telecel', 'airteltigo'].reduce((acc, net) => {
    acc[net] = bundles.filter((b) => b.network === net)
    return acc
  }, {} as Record<string, IBundle[]>)

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1A1A2E]" style={{ fontFamily: 'Syne, sans-serif' }}>Data Bundles</h1>
        <Button onClick={openNew} className="bg-[#F5A623] hover:bg-[#e09315] text-[#1A1A2E] gap-2 font-bold">
          <Plus className="w-4 h-4" /> Add Bundle
        </Button>
      </div>

      {(['mtn', 'telecel', 'airteltigo'] as NetworkId[]).map((net) => {
        const netBundles = grouped[net] ?? []
        const cfg = NETWORKS[net]
        return (
          <div key={net} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 flex items-center gap-3 border-b border-gray-100" style={{ backgroundColor: cfg.bgColor }}>
              <NetworkBadge network={net} size="sm" />
              <span className="font-bold text-sm" style={{ color: cfg.textColor }}>{cfg.label}</span>
              <span className="text-xs text-gray-400 ml-auto">{netBundles.length} bundles</span>
            </div>
            {netBundles.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    {['Size', 'Price', 'Validity', 'Category', 'Badge', 'Active', ''].map((h) => (
                      <th key={h} className="text-left py-2 px-4 text-xs font-semibold text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {netBundles.map((b) => (
                    <tr key={b._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 px-4 font-bold" style={{ color: cfg.primaryColor }}>{b.size}</td>
                      <td className="py-2.5 px-4">{formatPrice(b.price)}</td>
                      <td className="py-2.5 px-4 text-gray-500">{b.validity}</td>
                      <td className="py-2.5 px-4 capitalize text-gray-500">{b.category}</td>
                      <td className="py-2.5 px-4 text-gray-400">{b.badge ?? '—'}</td>
                      <td className="py-2.5 px-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {b.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openEdit(b)}><Pencil className="w-3.5 h-3.5" /></Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:text-red-600" onClick={() => deleteBundle(b._id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-gray-400 py-5 px-4">No {cfg.label} bundles yet.</p>
            )}
          </div>
        )
      })}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Bundle' : 'Add Bundle'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <Label>Network</Label>
              <Select onValueChange={(v) => setValue('network', v as NetworkId)} defaultValue={editing?.network ?? 'mtn'}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mtn">MTN</SelectItem>
                  <SelectItem value="telecel">Telecel</SelectItem>
                  <SelectItem value="airteltigo">AirtelTigo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Size (e.g. 5GB)</Label>
                <Input {...register('size')} placeholder="5GB" className="mt-1" />
              </div>
              <div>
                <Label>Size Value (num)</Label>
                <Input type="number" {...register('sizeValue', { valueAsNumber: true })} placeholder="5" className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Price (GH¢)</Label>
                <Input type="number" step="0.01" {...register('price', { valueAsNumber: true })} placeholder="15.00" className="mt-1" />
              </div>
              <div>
                <Label>Validity</Label>
                <Input {...register('validity')} placeholder="30 days" className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <Select onValueChange={(v) => setValue('category', v as BundleCategory)} defaultValue={editing?.category ?? 'monthly'}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Badge (optional)</Label>
              <Input {...register('badge')} placeholder="Best value" className="mt-1" />
            </div>
            <Button type="submit" className="w-full bg-[#1A1A2E] text-white">
              {editing ? 'Update' : 'Create'} Bundle
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
