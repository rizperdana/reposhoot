'use client'
import { ScreenshotRecord } from '@/lib/templates'

interface ScreenshotHistoryProps {
  history: ScreenshotRecord[]
  onDelete: (id: string) => void
  onLoad: (record: ScreenshotRecord) => void
}

export function ScreenshotHistory({ history, onDelete, onLoad }: ScreenshotHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-white/30">
        <p>No screenshots yet</p>
        <p className="text-xs mt-2">Take one to see it here</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {history.map(h => (
        <div key={h.id} className="group relative rounded-lg overflow-hidden border border-white/5 hover:border-white/20 transition-colors">
          <img 
            src={h.dataUrl} 
            alt={h.repository}
            className="w-full aspect-video object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => onLoad(h)}
              className="px-3 py-1.5 rounded bg-white/10 text-white text-xs hover:bg-white/20"
            >
              Load
            </button>
            <button
              onClick={() => onDelete(h.id)}
              className="px-3 py-1.5 rounded bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30"
            >
              Delete
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-xs text-white truncate">{h.repository}</p>
            <p className="text-xs text-white/40">{new Date(h.timestamp).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  )
}