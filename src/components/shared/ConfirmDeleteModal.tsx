'use client'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
}

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  title = 'Delete item',
  description = 'This action cannot be undone.',
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xs text-center">
        <DialogHeader className="items-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <DialogTitle className="text-[#1A2E42]">{title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-[#5A7A99] -mt-1">{description}</p>
        <div className="flex gap-3 mt-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            onClick={() => { onConfirm(); onClose() }}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
