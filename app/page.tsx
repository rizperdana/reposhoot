'use client'
import { useState, useEffect, useRef } from 'react'
import { RepoInput } from '@/components/repo-input'
import { TemplateSelector } from '@/components/template-selector'
import { PreviewCanvas } from '@/components/preview-canvas'
import { ExportButtons } from '@/components/export-buttons'
import { Footer } from '@/components/footer'
import { TemplateId, RenderData } from '@/lib/templates'
import { getRepoInfo, getContributors, getLatestRelease, getLanguages, getReadme } from '@/lib/github'

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
      const [repoInfo, contributors, release, languages, readme] = await Promise.all([
        getRepoInfo(o, r),
        getContributors(o, r),
        getLatestRelease(o, r),
        getLanguages(o, r),
        getReadme(o, r),
      ])
      
      setData({
        repo: repoInfo,
        contributors,
        release,
        languages,
        readme,
      })
      
      // Save to cookie
      document.cookie = `lastRepo=${o}/${r};max-age=${30*24*60*60};path=/`
    } catch (err) {
      setError('Repo not found or API rate limited')
    }
    
    setLoading(false)
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold animate-fade-in" style={{color:'#fff'}}>reposhoot</h1>
        <a 
          href="https://github.com/rizperdana/reposhoot" 
          target="_blank"
          className="text-sm hover:underline"
          style={{color:'#6c7086'}}
        >
          GitHub
        </a>
      </header>
      
      <div className="animate-slide-up delay-100">
        <RepoInput onSubmit={handleSubmit} />
      </div>
      
      {error && <p className="text-red-400 mt-4">{error}</p>}
      
      <div className="mt-6 animate-slide-up delay-200">
        <TemplateSelector 
          selected={templateId} 
          onChange={setTemplateId} 
        />
      </div>
      
      <div className="mt-6 animate-slide-up delay-300" ref={previewRef}>
        <PreviewCanvas templateId={templateId} data={data} loading={loading} />
      </div>
      
      {data && (
        <div className="mt-6 animate-slide-up delay-400">
          <ExportButtons targetRef={previewRef} />
        </div>
      )}
      
      <Footer />
    </main>
  )
}