'use client'
import { useState, useEffect, useRef } from 'react'
import { RepoInput } from '@/components/repo-input'
import { TemplateSelector } from '@/components/template-selector'
import { PreviewCanvas } from '@/components/preview-canvas'
import { ExportButtons } from '@/components/export-buttons'
import { Footer } from '@/components/footer'
import { CookieNotice } from '@/components/cookie-notice'
import { TemplateId, templates, RenderData } from '@/lib/templates'
import { getRepoInfo, getContributors, getLatestRelease, getLanguages, getReadme } from '@/lib/github'

export default function Home() {
  const [owner, setOwner] = useState('')
  const [repo, setRepo] = useState('')
  const [templateId, setTemplateId] = useState<TemplateId>('readme')
  const [data, setData] = useState<RenderData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const previewRef = useRef<HTMLDivElement>(null)

  // Load last repo on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const last = document.cookie.split('; ').find(r => r.startsWith('lastRepo='))?.split('=')[1]
      if (last?.includes('/')) { const [o, r] = last.split('/'); handleSubmit(o, r) }
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
      setData({ repo: repoInfo, contributors, release, languages, readme })
      document.cookie = `lastRepo=${o}/${r};max-age=${30*24*60*60};path=/`
    } catch { setError('Repo not found or rate limited') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen relative">
      {/* Background effects */}
      <div className="bg-grid fixed"></div>
      <div className="bg-noise fixed"></div>
      <CookieNotice />
      
      <main className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        {/* Nav */}
        <nav className="flex justify-between items-center py-2 animate-fade-up">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#63b3ed] to-[#b794f4]">
              <span className="text-sm">📸</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-white font-sans">reposhoot</span>
          </div>
          
          <a 
            href="https://github.com/rizperdana/reposhoot" 
            target="_blank" 
            rel="noopener"
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHub
          </a>
        </nav>

        {/* Input */}
        <div className="animate-fade-up delay-100">
          <RepoInput onSubmit={handleSubmit} />
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm animate-fade-up">
            {error}
          </div>
        )}

        {/* Template selector */}
        <div className="animate-fade-up delay-200">
          <TemplateSelector selected={templateId} onChange={setTemplateId} />
        </div>

        {/* Preview */}
        <div className="animate-fade-up delay-300" ref={previewRef}>
          <PreviewCanvas 
            templateId={templateId} 
            data={data} 
            loading={loading} 
          />
        </div>

        {/* Export buttons */}
        {data && (
          <div className="animate-fade-up">
            <ExportButtons targetRef={previewRef} />
          </div>
        )}

        <Footer />
      </main>
    </div>
  )
}