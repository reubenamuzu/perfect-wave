import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-[#F5A623]" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  )
}
