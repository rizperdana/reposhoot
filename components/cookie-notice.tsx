'use client'
import { useState, useEffect } from 'react'

export function CookieNotice() {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    setDismissed(!!localStorage.getItem('cookie-notice-dismissed'))
  }, [])

  if (dismissed) return null

  return (
    <div className="fixed bottom-4 right-4 max-w-xs p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white/40 backdrop-blur-sm animate-fade-in" style={{animationDelay: '500ms'}}>
      <p>We use cookies to remember your last repo.</p>
      <button 
        onClick={() => { localStorage.setItem('cookie-notice-dismissed', '1'); setDismissed(true) }}
        className="mt-2 text-white/60 hover:text-white"
      >
        Got it
      </button>
    </div>
  )
}