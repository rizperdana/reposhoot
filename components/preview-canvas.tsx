'use client'
import { TemplateId, RenderData } from '@/lib/templates'
import { 
  renderReadmeTemplate, 
  renderContributorsTemplate, 
  renderReleaseTemplate, 
  renderStatsTemplate, 
  renderTechStackTemplate, 
  renderMinimalTemplate 
} from '@/lib/templates'

interface PreviewCanvasProps {
  templateId: TemplateId
  data: RenderData | null
  loading?: boolean
}

export function PreviewCanvas({ templateId, data, loading }: PreviewCanvasProps) {
  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center rounded-lg animate-pulse-glow" 
        style={{background:'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #0f0f0f 100%)',border:'1px solid rgba(255,255,255,0.1)'}}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p style={{color:'#6c7086',marginTop:'12px'}}>Loading repo...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="w-full h-96 flex items-center justify-center rounded-lg" 
        style={{background:'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #0f0f0f 100%)',border:'1px solid rgba(255,255,255,0.1)'}}>
        <div className="text-center">
          <p style={{color:'#6c7086'}}>Enter a GitHub repo to preview</p>
          <p style={{color:'#45475a',fontSize:'12px',marginTop:'8px'}}>Try: rtk-ai/rtk</p>
        </div>
      </div>
    )
  }

  const { repo, contributors, release, languages, readme } = data
  
  let html = ''
  switch (templateId) {
    case 'readme':
      html = renderReadmeTemplate(repo, contributors, readme)
      break
    case 'contributors':
      html = renderContributorsTemplate(repo, contributors)
      break
    case 'release':
      html = renderReleaseTemplate(repo, release)
      break
    case 'stats':
      html = renderStatsTemplate(repo)
      break
    case 'techstack':
      html = renderTechStackTemplate(repo, languages)
      break
    case 'minimal':
      html = renderMinimalTemplate(repo)
      break
    default:
      html = renderMinimalTemplate(repo)
  }

  return (
    <div 
      className="w-full p-2 rounded-lg preview-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}