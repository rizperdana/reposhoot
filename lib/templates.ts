import { RepoInfo, Contributor, Release, Language } from './github'

export type TemplateId = 'readme' | 'contributors' | 'release' | 'stats' | 'techstack' | 'minimal'

export interface ScreenshotRecord {
  id: string
  repository: string
  template: TemplateId
  dataUrl: string
  timestamp: number
}

export interface TemplateConfig {
  id: TemplateId
  name: string
}

export const templates: TemplateConfig[] = [
  { id: 'readme', name: 'README' },
  { id: 'contributors', name: 'Contributors' },
  { id: 'release', name: 'Release' },
  { id: 'stats', name: 'Stats' },
  { id: 'techstack', name: 'Tech Stack' },
  { id: 'minimal', name: 'Minimal' },
]

export interface RenderData {
  repo: RepoInfo
  contributors: Contributor[]
  release: Release | null
  languages: Language[]
  readme: string
}

const darkBase = `background:#0d0d12;font-family:system-ui,-apple-system,sans-serif`

export function renderReadmeTemplate(repo: RepoInfo, contributors: Contributor[], readme: string): string {
  const contributorAvatars = contributors.slice(0, 12).map(c => 
    `<img src="${c.avatarUrl}" style="width:28px;height:28px;border-radius:50%;margin-right:2px;border:2px solid #1a1a2e" />`
  ).join('')
  
  const readmeHtml = readme ? `<div style="color:#a6adc8;font-size:13px;line-height:1.6;max-height:200px;overflow:hidden">${readme.slice(0, 800)}...</div>` : '<p style="color:#6c7086">No README</p>'
  
  return `
    <div style="${darkBase};padding:24px;border-radius:12px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <img src="${repo.ownerAvatar}" style="width:40px;height:40px;border-radius:10px" />
        <div>
          <h1 style="font-size:20px;font-weight:700;color:#fff;margin:0">${repo.name}</h1>
          <p style="font-size:12px;color:#6c7086">${repo.owner}</p>
        </div>
      </div>
      
      <div style="background:#18181b;border-radius:8px;padding:16px;margin-bottom:16px">
        ${readmeHtml}
      </div>
      
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div style="display:flex;gap:12px;font-size:13px">
          <span style="color:#f9e2af">★ ${repo.stars}</span>
          <span style="color:#f5c2e7">⑂ ${repo.forks}</span>
          <span style="color:#89b4fa">👁 ${repo.watchers}</span>
        </div>
        <div style="display:flex">${contributorAvatars}</div>
      </div>
    </div>
  `
}

export function renderStatsTemplate(repo: RepoInfo): string {
  return `
    <div style="${darkBase};padding:24px;border-radius:12px">
      <h1 style="font-size:20px;font-weight:700;color:#fff;margin-bottom:16px">${repo.name}</h1>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
        <div style="background:#18181b;padding:12px;border-radius:8px;text-align:center">
          <div style="font-size:18px;font-weight:700;color:#f9e2af">${repo.stars}</div>
          <div style="font-size:10px;color:#6c7086">STARS</div>
        </div>
        <div style="background:#18181b;padding:12px;border-radius:8px;text-align:center">
          <div style="font-size:18px;font-weight:700;color:#f5c2e7">${repo.forks}</div>
          <div style="font-size:10px;color:#6c7086">FORKS</div>
        </div>
        <div style="background:#18181b;padding:12px;border-radius:8px;text-align:center">
          <div style="font-size:18px;font-weight:700;color:#89b4fa">${repo.watchers}</div>
          <div style="font-size:10px;color:#6c7086">WATCH</div>
        </div>
        <div style="background:#18181b;padding:12px;border-radius:8px;text-align:center">
          <div style="font-size:18px;font-weight:700;color:#f38ba8">${repo.openIssues}</div>
          <div style="font-size:10px;color:#6c7086">ISSUES</div>
        </div>
      </div>
    </div>
  `
}

export function renderContributorsTemplate(repo: RepoInfo, contributors: Contributor[]): string {
  const avatars = contributors.slice(0, 15).map(c => 
    `<img src="${c.avatarUrl}" style="width:40px;height:40px;border-radius:50%;border:2px solid #1a1a2e" />`
  ).join('')
  
  return `
    <div style="${darkBase};padding:24px;border-radius:12px">
      <h1 style="font-size:20px;font-weight:700;color:#fff;margin-bottom:4px">${repo.name}</h1>
      <p style="font-size:12px;color:#6c7086;margin-bottom:16px">${contributors.length} contributors</p>
      <div style="display:flex;gap:4px;flex-wrap:wrap">${avatars}</div>
    </div>
  `
}

export function renderTechStackTemplate(repo: RepoInfo, languages: Language[]): string {
  const max = Math.max(...languages.map(l => l.bytes))
  const bars = languages.slice(0, 6).map(l => 
    `<div style="display:flex;align-items:center;gap:8px;margin-top:6px">
      <span style="width:60px;font-size:11px;color:#cdd6e4">${l.name}</span>
      <div style="flex:1;height:8px;background:#18181b;border-radius:4px">
        <div style="height:100%;border-radius:4px;width:${(l.bytes/max)*100}%;background:${l.color}"></div>
      </div>
    </div>`
  ).join('')
  
  return `
    <div style="${darkBase};padding:24px;border-radius:12px">
      <h1 style="font-size:20px;font-weight:700;color:#fff">${repo.name}</h1>
      <p style="font-size:12px;color:#6c7086;margin-top:4px">${repo.language}</p>
      <div style="margin-top:16px">${bars}</div>
    </div>
  `
}

export function renderReleaseTemplate(repo: RepoInfo, release: Release | null): string {
  if (!release) {
    return renderMinimalTemplate(repo)
  }
  
  return `
    <div style="${darkBase};padding:24px;border-radius:12px">
      <h1 style="font-size:20px;font-weight:700;color:#fff">${repo.name}</h1>
      <div style="margin-top:16px;padding:16px;background:#18181b;border-radius:8px;border:1px solid #313244">
        <span style="color:#a6e3a1;font-family:monospace;font-size:12px">${release.tagName}</span>
        <p style="color:#cdd6e4;margin-top:8px;font-size:14px">${release.name || ''}</p>
        <p style="color:#6c7086;font-size:10px;margin-top:4px">${new Date(release.publishedAt).toLocaleDateString()}</p>
      </div>
    </div>
  `
}

export function renderMinimalTemplate(repo: RepoInfo): string {
  return `
    <div style="${darkBase};padding:24px;border-radius:12px">
      <h1 style="font-size:20px;font-weight:700;color:#fff">${repo.name}</h1>
      <p style="color:#6c7086;margin-top:4px;font-size:14px">${repo.description || 'No description'}</p>
    </div>
  `
}