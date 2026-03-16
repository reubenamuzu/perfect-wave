'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Upload, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ConfirmDeleteModal from '@/components/shared/ConfirmDeleteModal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { IGalleryItem, GalleryCategory } from '@/types'

export default function AdminGalleryPage() {
  const [items, setItems] = useState<IGalleryItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [captions, setCaptions] = useState<Record<string, string>>({})
  const [categories, setCategories] = useState<Record<string, GalleryCategory>>({})

  useEffect(() => {
    fetch('/api/gallery').then((r) => r.json()).then((d) => {
      const arr = d.items ?? []
      setItems(arr)
      const c: Record<string, string> = {}
      const cat: Record<string, GalleryCategory> = {}
      arr.forEach((i: IGalleryItem) => { c[i._id] = i.caption; cat[i._id] = i.category })
      setCaptions(c); setCategories(cat)
    })
  }, [])

  async function handleUpload(files: FileList) {
    setUploading(true)
    for (const file of Array.from(files)) {
      try {
        const fd = new FormData(); fd.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (data.url) {
          const r2 = await fetch('/api/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: data.url, caption: '', category: 'showcase' }),
          })
          if (r2.ok) { const saved = await r2.json(); setItems((prev) => [...prev, saved.item]) }
        }
      } catch { toast.error(`Failed to upload ${file.name}`) }
    }
    setUploading(false)
    toast.success('Upload complete')
  }

  async function confirmDelete() {
    if (!deleteId) return
    await fetch(`/api/gallery/${deleteId}`, { method: 'DELETE' })
    setItems((prev) => prev.filter((i) => i._id !== deleteId))
    toast.success('Image deleted')
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-[#1A2E42]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Gallery</h1>
        <label className="cursor-pointer">
          <div className="inline-flex items-center gap-2 font-bold bg-[#1B6CA8] hover:bg-[#0D4F82] text-white px-4 py-2 rounded-md text-sm transition-colors cursor-pointer">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Upload Images
          </div>
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleUpload(e.target.files)} />
        </label>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="relative h-32">
                <Image src={item.imageUrl} alt={item.caption || 'Gallery'} fill className="object-cover" />
              </div>
              <div className="p-2 space-y-1.5">
                <Input
                  value={captions[item._id] ?? ''}
                  onChange={(e) => setCaptions((p) => ({ ...p, [item._id]: e.target.value }))}
                  placeholder="Caption"
                  className="h-7 text-xs"
                />
                <Select
                  value={categories[item._id] ?? 'showcase'}
                  onValueChange={(v) => setCategories((p) => ({ ...p, [item._id]: v as GalleryCategory }))}
                >
                  <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frames">Frames</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                    <SelectItem value="showcase">Showcase</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="destructive" className="w-full h-6 text-xs" onClick={() => setDeleteId(item._id)}>
                  <Trash2 className="w-3 h-3 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-gray-400">
          <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No gallery images yet. Upload some!</p>
        </div>
      )}
    <ConfirmDeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete image?"
        description="This image will be permanently removed and can't be recovered."
      />
    </div>
  )
}
