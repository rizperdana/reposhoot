'use client'
import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface RepoInputProps {
  onSubmit: (owner: string, repo: string) => void
}

export function RepoInput({ onSubmit }: RepoInputProps) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    let owner = ''
    let repo = ''
    
    if (value.includes('github.com')) {
      const regex = /github\.com[/:]([^/]+)\/([^/]+)/
      const match = value.match(regex)
      if (match) {
        owner = match[1]
        repo = match[2].replace('.git', '')
      }
    } else if (value.includes('/')) {
      const parts = value.split('/')
      owner = parts[0]
      repo = parts[1]
    } else {
      owner = value
      repo = ''
    }
    
    if (owner && repo) {
      onSubmit(owner, repo)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="owner/repo or GitHub URL"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Go'}
      </Button>
    </form>
  )
}