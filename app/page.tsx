'use client'
import { useState, useEffect, useRef } from 'react'
import { RepoInput } from '@/components/repo-input'
import { TemplateSelector } from '@/components/template-selector'
import { PreviewCanvas } from '@/components/preview-canvas'
import { ExportButtons } from '@/components/export-buttons'
import { Footer } from '@/components/footer'
import { TemplateId, RenderData } from '@/lib/templates'
import { getRepoInfo, getContributors, getLatestRelease, getLanguages } from '@/lib/github'

export default function Home() {
  const [owner, setOwner] = useState('')
  const [repo, setRepo] = useState('')
  const [templateId, setTemplateId] = useState<TemplateId>('readme')
  const [data, setData] = useState<RenderData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const previewRef = useRef<HTMLDivElement>(null)

  // Cookie storage
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const lastRepo = document.cookie
        .split('; ')
        .find(row => row.startsWith('lastRepo='))
        ?.split('=')[1]
      
      if (lastRepo && lastRepo.includes('/')) {
        const [o, r] = lastRepo.split('/')
        handleSubmit(o, r)
      }
    }
  }, [])

  const handleSubmit = async (o: string, r: string) => {
    setOwner(o)
    setRepo(r)
    setLoading(true)
    setError('')
    
    try {
      const [repoInfo, contributors, release, languages] = await Promise.all([
        getRepoInfo(o, r),
        getContributors(o, r),
        getLatestRelease(o, r),
        getLanguages(o, r),
      ])
      
      setData({
        repo: repoInfo,
        contributors,
        release,
        languages,
        readme: '',
      })
      
      // Save to cookie
      document.cookie = `lastRepo=${o}/${r};max-age=${30*24*60*60};path=/`
    } catch (err) {
      setError('Repo not found or API rate limited')
    }
    
    setLoading(false)
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">reposhoot</h1>
        <a 
          href="https://github.com/rizperdana/reposhoot" 
          target="_blank"
          className="text-sm hover:underline"
        >
          GitHub
        </a>
      </header>
      
      <RepoInput onSubmit={handleSubmit} />
      
      {error && <p className="text-red-500 mt-4">{error}</p>}
      
      <div className="mt-6">
        <TemplateSelector 
          selected={templateId} 
          onChange={setTemplateId} 
        />
      </div>
      
      <div className="mt-6" ref={previewRef}>
        <PreviewCanvas templateId={templateId} data={data} />
      </div>
      
      {data && (
        <div className="mt-6">
          <ExportButtons targetRef={previewRef} />
        </div>
      )}
      
      <Footer />
    </main>
  )
}