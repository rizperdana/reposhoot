'use client'
import { useState } from 'react'

interface RepoInputProps {
  onSubmit: (owner: string, repo: string) => void
}

export function RepoInput({ onSubmit }: RepoInputProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const v = value.trim()
    if (!v) return
    if (v.includes('/')) {
      const [o, r] = v.split('/')
      onSubmit(o.trim(), r.trim())
    } else {
      onSubmit(v, '')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="owner/repo"
        className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors"
      />
      <button
        type="submit"
        className="px-5 py-3 rounded-lg bg-green-500 hover:bg-green-400 text-black font-medium transition-colors"
      >
        Generate
      </button>
    </form>
  )
}