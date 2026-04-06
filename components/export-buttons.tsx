'use client'
import { useState } from 'react'
import { Button } from './ui/button'
import html2canvas from 'html2canvas'

interface ExportButtonsProps {
  targetRef: React.RefObject<HTMLDivElement | null>
}

export function ExportButtons({ targetRef }: ExportButtonsProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async (format: 'png' | 'jpg') => {
    if (!targetRef?.current) return
    setLoading(true)
    
    try {
      const canvas = await html2canvas(targetRef.current, {
        useCORS: true,
        scale: 2,
      })
      
      const link = document.createElement('a')
      link.download = `reposhoot.${format}`
      link.href = canvas.toDataURL(`image/${format}`)
      link.click()
    } catch (err) {
      console.error('Export failed:', err)
    }
    
    setLoading(false)
  }

  const handleCopy = async () => {
    if (!targetRef?.current) return
    setLoading(true)
    
    try {
      const canvas = await html2canvas(targetRef.current, {
        useCORS: true,
        scale: 2,
      })
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ])
        }
      })
    } catch (err) {
      console.error('Copy failed:', err)
    }
    
    setLoading(false)
  }

  const handleShare = (platform: 'twitter' | 'linkedin' | 'hn') => {
    const text = 'Check out this repo!'
    const url = window.location.href
    
    let shareUrl = ''
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case 'hn':
        shareUrl = `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(url)}&t=${encodeURIComponent(text)}`
        break
    }
    
    window.open(shareUrl, '_blank')
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <Button onClick={() => handleDownload('png')} disabled={loading}>
        Download PNG
      </Button>
      <Button onClick={() => handleDownload('jpg')} disabled={loading}>
        Download JPG
      </Button>
      <Button onClick={handleCopy} disabled={loading}>
        {loading ? 'Copying...' : 'Copy'}
      </Button>
      <Button variant="outline" onClick={() => handleShare('twitter')}>
        Twitter
      </Button>
      <Button variant="outline" onClick={() => handleShare('linkedin')}>
        LinkedIn
      </Button>
      <Button variant="outline" onClick={() => handleShare('hn')}>
        HN
      </Button>
    </div>
  )
}