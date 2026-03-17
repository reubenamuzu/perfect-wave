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
import ConfirmDeleteModal from '@/components/shared/ConfirmDeleteModal'
import NetworkBadge from '@/components/shared/NetworkBadge'
import { NETWORKS } from '@/lib/networkConfig'
import { formatPrice } from '@/lib/utils'
import type { IBundle, NetworkId } from '@/types'

const schema = z.object({
  network: z.enum(['mtn', 'telecel', 'airteltigo']),
  size: z.string().min(1),
  sizeValue: z.number().positive(),
  price: z.number().positive(),
  validity: z.string().optional(),
  badge: z.string().optional(),
  isActive: z.boolean(),
})
type FormData = z.infer<typeof schema>

export default function BundlesPage() {
  const [bundles, setBundles] = useState<IBundle[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<IBundle | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [noExpiry, setNoExpiry] = useState(false)
  const [validityDays, setValidityDays] = useState<number | ''>(30)

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { network: 'mtn', isActive: true },
  })

  useEffect(() => {
    fetch('/api/bundles?admin=true').then((r) => r.json()).then((d) => setBundles(d.bundles ?? []))
  }, [])

  function openNew() {
    setEditing(null)
    setNoExpiry(false)
    setValidityDays(30)
    reset({ network: 'mtn', isActive: true })
    setOpen(true)
  }

  function openEdit(bundle: IBundle) {
    setEditing(bundle)
    const isNoExpiry = bundle.validity === 'No expiry'
    setNoExpiry(isNoExpiry)
    setValidityDays(isNoExpiry ? 30 : parseInt(bundle.validity) || 30)
    reset({ ...bundle, badge: bundle.badge ?? '', price: bundle.price ?? undefined })
    setOpen(true)
  }

  async function onSubmit(data: FormData) {
    try {
      const validity = noExpiry ? 'No expiry' : `${validityDays} days`
      const payload = { ...data, sizeValue: Number(data.sizeValue), price: Number(data.price), validity }
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

  async function toggleActive(bundle: IBundle) {
    const res = await fetch(`/api/bundles/${bundle._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !bundle.isActive }),
    })
    if (res.ok) {
      setBundles((prev) => prev.map((b) => b._id === bundle._id ? { ...b, isActive: !bundle.isActive } : b))
      toast.success(bundle.isActive ? 'Bundle hidden from customers' : 'Bundle now visible to customers')
    }
  }

  async function confirmDelete() {
    if (!deleteId) return
    const res = await fetch(`/api/bundles/${deleteId}`, { method: 'DELETE' })
    if (res.ok) {
      setBundles((prev) => prev.filter((b) => b._id !== deleteId))
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
        <h1 className="text-2xl text-[#1A2E42]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Data Bundles</h1>
        <Button onClick={openNew} className="bg-[#1B6CA8] hover:bg-[#0D4F82] text-white gap-2">
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
              <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-130">
                <thead>
                  <tr className="border-b border-gray-50">
                    {['Size', 'Price', 'Validity', 'Badge', 'Active', ''].map((h) => (
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
                      <td className="py-2.5 px-4 text-gray-400">{b.badge ?? '—'}</td>
                      <td className="py-2.5 px-4">
                        <button
                          onClick={() => toggleActive(b)}
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold transition-colors cursor-pointer ${b.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                          {b.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openEdit(b)}><Pencil className="w-3.5 h-3.5" /></Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:text-red-600" onClick={() => setDeleteId(b._id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-5 px-4">No {cfg.label} bundles yet.</p>
            )}
          </div>
        )
      })}

      <ConfirmDeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete bundle?"
        description="This bundle will be permanently removed and can't be recovered."
      />

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
                <div className="flex gap-1 mt-1">
                  <button
                    type="button"
                    onClick={() => setNoExpiry(false)}
                    className={`flex-1 px-2 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${!noExpiry ? 'bg-[#1B6CA8] text-white border-[#1B6CA8]' : 'border-gray-200 text-gray-500'}`}
                  >
                    Days
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoExpiry(true)}
                    className={`flex-1 px-2 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${noExpiry ? 'bg-[#1B6CA8] text-white border-[#1B6CA8]' : 'border-gray-200 text-gray-500'}`}
                  >
                    No expiry
                  </button>
                </div>
                {!noExpiry && (
                  <Input
                    type="number"
                    min={1}
                    value={validityDays}
                    onChange={(e) => setValidityDays(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="30"
                    className="mt-1"
                  />
                )}
              </div>
            </div>
            <div>
              <Label>Badge (optional)</Label>
              <Input {...register('badge')} placeholder="Best value" className="mt-1" />
            </div>
            <Button type="submit" className="w-full bg-[#1B6CA8] hover:bg-[#0D4F82] text-white">
              {editing ? 'Update' : 'Create'} Bundle
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
