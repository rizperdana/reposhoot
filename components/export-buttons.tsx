'use client'
import { useRef, useState } from 'react'

interface ExportButtonsProps {
  targetRef: React.RefObject<HTMLElement>
  onScreenshotReady?: (dataUrl: string) => void
}

export function ExportButtons({ targetRef, onScreenshotReady }: ExportButtonsProps) {
  const [loading, setLoading] = useState('')
  
  const capture = async (format: string) => {
    if (!targetRef.current) return
    setLoading(format)
    
    // Dynamic import to avoid SSR issues
    const html2canvas = (await import('html2canvas')).default
    
    try {
      const canvas = await html2canvas(targetRef.current, {
        backgroundColor: null,
        scale: 2,
      })
      
      const dataUrl = canvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : 'png'}`)
      
      if (format === 'copy') {
        canvas.toBlob(blob => {
          if (blob) navigator.clipboard.write([new ClipboardItem({ [`image/${format === 'jpg' ? 'jpeg' : 'png'}`]: blob })])
        })
      } else if (format === 'twitter' || format === 'linkedin' || format === 'hackernews') {
        const link = document.createElement('a')
        link.download = `reposhoot.${format === 'jpg' ? 'png' : format === 'twitter' ? 'jpg' : 'png'}`
        link.href = dataUrl
        link.click()
      } else {
        const link = document.createElement('a')
        link.download = `reposhoot.${format === 'jpg' ? 'jpeg' : 'png'}`
        link.href = dataUrl
        link.click()
        
        if (onScreenshotReady) onScreenshotReady(dataUrl)
      }
    } catch (err) {
      console.error(err)
    }
    setLoading('')
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <button onClick={() => capture('png')} disabled={loading === 'png'} className="px-3 py-2 rounded-lg bg-white/5 text-white/70 text-sm hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50">
        {loading === 'png' ? '...' : 'PNG'}
      </button>
      <button onClick={() => capture('jpg')} disabled={loading === 'jpg'} className="px-3 py-2 rounded-lg bg-white/5 text-white/70 text-sm hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50">
        {loading === 'jpg' ? '...' : 'JPG'}
      </button>
      <button onClick={() => capture('copy')} disabled={loading === 'copy'} className="px-3 py-2 rounded-lg bg-white/5 text-white/70 text-sm hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50">
        {loading === 'copy' ? '...' : 'Copy'}
      </button>
    </div>
  )
}