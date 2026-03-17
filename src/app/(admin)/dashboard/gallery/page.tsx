'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Upload, Trash2, Loader2, ImagePlus, Pencil, X, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ConfirmDeleteModal from '@/components/shared/ConfirmDeleteModal'
import type { IGalleryItem, GalleryCategory } from '@/types'

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  frames: 'Frames',
  custom: 'Custom',
  showcase: 'Showcase',
}

const CATEGORY_COLORS: Record<GalleryCategory, string> = {
  frames: 'bg-blue-100 text-blue-700',
  custom: 'bg-purple-100 text-purple-700',
  showcase: 'bg-teal-100 text-teal-700',
}

interface UploadForm {
  title: string
  description: string
  category: GalleryCategory
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<IGalleryItem[]>([])
  const [uploadOpen, setUploadOpen] = useState(false)
  const [editItem, setEditItem] = useState<IGalleryItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [form, setForm] = useState<UploadForm>({ title: '', description: '', category: 'showcase' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/gallery').then((r) => r.json()).then((d) => setItems(d.items ?? []))
  }, [])

  function openUpload() {
    setEditItem(null)
    setPreviewUrl(null)
    setSelectedFile(null)
    setForm({ title: '', description: '', category: 'showcase' })
    setUploadOpen(true)
  }

  function openEdit(item: IGalleryItem) {
    setEditItem(item)
    setPreviewUrl(item.imageUrl)
    setSelectedFile(null)
    setForm({ title: item.title ?? '', description: item.description ?? '', category: item.category })
    setUploadOpen(true)
  }

  function handleFileSelect(file: File) {
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) handleFileSelect(e.target.files[0])
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0])
  }

  async function handleSave() {
    if (!editItem && !selectedFile) { toast.error('Please select an image'); return }
    if (!form.title.trim()) { toast.error('Title is required'); return }

    setSaving(true)
    try {
      let imageUrl = editItem?.imageUrl ?? ''

      if (selectedFile) {
        setUploading(true)
        const fd = new FormData(); fd.append('file', selectedFile)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (!data.url) throw new Error('Upload failed')
        imageUrl = data.url
        setUploading(false)
      }

      const payload = { imageUrl, title: form.title, description: form.description, category: form.category, caption: form.title }

      if (editItem) {
        const res = await fetch(`/api/gallery/${editItem._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          const { item } = await res.json()
          setItems((prev) => prev.map((i) => (i._id === editItem._id ? item : i)))
          toast.success('Updated')
        }
      } else {
        const res = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          const { item } = await res.json()
          setItems((prev) => [item, ...prev])
          toast.success('Image uploaded')
        }
      }
      setUploadOpen(false)
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  async function confirmDelete() {
    if (!deleteId) return
    await fetch(`/api/gallery/${deleteId}`, { method: 'DELETE' })
    setItems((prev) => prev.filter((i) => i._id !== deleteId))
    toast.success('Image deleted')
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#1A2E42]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}>
            Gallery
          </h1>
          <p className="text-sm text-[#5A7A99]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {items.length} image{items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={openUpload} className="bg-[#1B6CA8] hover:bg-[#0D4F82] text-white gap-2">
          <ImagePlus className="w-4 h-4" />
          Add Image
        </Button>
      </div>

      {/* Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item) => (
            <div
              key={item._id}
              className="group bg-white rounded-2xl border border-[#C8DFF0] overflow-hidden"
              style={{ boxShadow: '0 2px 12px rgba(27,108,168,0.06)' }}
            >
              {/* Image */}
              <div className="relative h-44 bg-[#F4F8FC]">
                <Image src={item.imageUrl} alt={item.title || 'Gallery'} fill className="object-cover" />
                {/* Desktop: hover overlay */}
                <div className="absolute inset-0 bg-[#1A2E42]/60 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                    aria-label="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(item._id)}
                    className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile: always-visible action buttons */}
                <div className="absolute top-2 right-2 flex gap-1.5 sm:hidden">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-1.5 rounded-full bg-white/90 text-[#1B6CA8] shadow"
                    aria-label="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(item._id)}
                    className="p-1.5 rounded-full bg-red-500 text-white shadow"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Category badge */}
                <span
                  className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category]}`}
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {CATEGORY_LABELS[item.category]}
                </span>
              </div>

              {/* Info */}
              <div className="p-3.5">
                <p
                  className="text-sm font-semibold text-[#1A2E42] truncate mb-0.5"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  {item.title || <span className="text-[#5A7A99] font-normal italic">No title</span>}
                </p>
                {item.description ? (
                  <p
                    className="text-xs text-[#5A7A99] line-clamp-2"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    {item.description}
                  </p>
                ) : (
                  <p className="text-xs text-[#C8DFF0] italic" style={{ fontFamily: 'Outfit, sans-serif' }}>No description</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="py-24 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#C8DFF0]"
          style={{ backgroundColor: '#F4F8FC' }}
        >
          <ImageIcon className="w-12 h-12 text-[#C8DFF0] mb-3" />
          <p className="text-[#5A7A99] text-sm mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            No images yet. Add your first one!
          </p>
          <Button onClick={openUpload} className="bg-[#1B6CA8] hover:bg-[#0D4F82] text-white gap-2">
            <ImagePlus className="w-4 h-4" />
            Add Image
          </Button>
        </div>
      )}

      {/* Upload / Edit dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {editItem ? 'Edit Image' : 'Upload Image'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className="relative cursor-pointer rounded-xl overflow-hidden border-2 border-dashed transition-colors"
              style={{
                borderColor: dragOver ? '#1B6CA8' : '#C8DFF0',
                backgroundColor: dragOver ? '#EAF3FB' : '#F4F8FC',
                height: 180,
              }}
            >
              {previewUrl ? (
                <>
                  <Image src={previewUrl} alt="Preview" fill className="object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); setSelectedFile(null) }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <Upload className="w-8 h-8 text-[#5A7A99]" />
                  <p className="text-sm text-[#5A7A99]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Drag & drop or <span className="text-[#1B6CA8] font-medium">browse</span>
                  </p>
                  <p className="text-xs text-[#5A7A99]">PNG, JPG, WEBP up to 10MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileInput}
              />
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-[#1A2E42]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Premium Wood Frame — 5×7"
                className="border-[#C8DFF0] focus-visible:ring-[#1B6CA8]"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-[#1A2E42]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Description
              </Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Short description of this image…"
                rows={3}
                className="border-[#C8DFF0] focus-visible:ring-[#1B6CA8] resize-none"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label className="text-[#1A2E42]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Category
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v as GalleryCategory }))}
              >
                <SelectTrigger className="border-[#C8DFF0]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="showcase">Showcase</SelectItem>
                  <SelectItem value="frames">Frames</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                className="flex-1 border-[#C8DFF0] text-[#5A7A99]"
                onClick={() => setUploadOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#1B6CA8] hover:bg-[#0D4F82] text-white gap-2"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {uploading ? 'Uploading…' : 'Saving…'}
                  </>
                ) : (
                  <>{editItem ? 'Save Changes' : 'Upload Image'}</>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
