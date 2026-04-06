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
}

export function PreviewCanvas({ templateId, data }: PreviewCanvasProps) {
  if (!data) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <p className="text-gray-400">Enter a GitHub repo to preview</p>
      </div>
    )
  }

  const { repo, contributors, release, languages } = data
  
  let html = ''
  switch (templateId) {
    case 'readme':
      html = renderReadmeTemplate(repo, contributors)
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
      className="w-full p-8 bg-white rounded-lg shadow-sm overflow-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}