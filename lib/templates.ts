import { RepoInfo, Contributor, Release, Language } from './github'
import { markdownToHtml } from './github'

export type TemplateId = 'readme' | 'contributors' | 'release' | 'stats' | 'techstack' | 'minimal'

export interface TemplateConfig {
  id: TemplateId
  name: string
  description: string
}

export const templates: TemplateConfig[] = [
  { id: 'readme', name: 'README Focus', description: 'Large rendered markdown, stats footer' },
  { id: 'contributors', name: 'Contributors', description: 'Avatar grid + count' },
  { id: 'release', name: 'Release Hype', description: 'Latest release notes hero' },
  { id: 'stats', name: 'Stats Dashboard', description: 'Stars/forks/issues cards' },
  { id: 'techstack', name: 'Tech Stack', description: 'Language bars + badges' },
  { id: 'minimal', name: 'Minimal', description: 'Name + description only' },
]

export interface RenderData {
  repo: RepoInfo
  contributors: Contributor[]
  release: Release | null
  languages: Language[]
  readme: string
}

// Dark theme styles
const darkBase = `
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #0f0f0f 100%);
  font-family: system-ui, -apple-system, sans-serif;
`

// README template - shows half README half stats
export function renderReadmeTemplate(repo: RepoInfo, contributors: Contributor[], readme: string): string {
  const readmeHtml = markdownToHtml(readme)
  const contributorAvatars = contributors.slice(0, 12).map(c => 
    `<img src="${c.avatarUrl}" style="width:32px;height:32px;border-radius:50%;margin-right:4px;border:2px solid #1e1e2e" />`
  ).join('')
  
  return `
    <div style="${darkBase};padding:32px;border-radius:12px;max-width:800px">
      <!-- Header -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
        <img src="${repo.ownerAvatar}" style="width:48px;height:48px;border-radius:12px" />
        <div>
          <h1 style="font-size:24px;font-weight:700;color:#fff;margin:0">${repo.name}</h1>
          <p style="font-size:14px;color:#6c7086;margin:4px 0 0">by ${repo.owner}</p>
        </div>
      </div>
      
      <!-- README Content - Half screen -->
      <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:20px;margin-bottom:20px;max-height:280px;overflow:hidden">
        ${readmeHtml || '<p style="color:#6c7086">No README available</p>'}
      </div>
      
      <!-- Stats footer -->
      <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center">
        <div style="display:flex;gap:12px">
          <span style="display:flex;align-items:center;gap:4px;color:#f9e2af;font-size:14px">⭐ ${repo.stars.toLocaleString()}</span>
          <span style="display:flex;align-items:center;gap:4px;color:#f5c2e7;font-size:14px">🍴 ${repo.forks.toLocaleString()}</span>
          <span style="display:flex;align-items:center;gap:4px;color:#89b4fa;font-size:14px">👁️ ${repo.watchers.toLocaleString()}</span>
        </div>
        <div style="display:flex;gap:4px;margin-left:auto">
          ${contributorAvatars}
        </div>
      </div>
      
      <!-- Made with reposhoot badge -->
      <div style="text-align:right;margin-top:16px">
        <span style="font-size:11px;color:#45475a">Made with reposhoot</span>
      </div>
    </div>
  `
}

export function renderContributorsTemplate(repo: RepoInfo, contributors: Contributor[]): string {
  const avatars = contributors.slice(0, 12).map((c: Contributor) => 
    `<img src="${c.avatarUrl}" style="width:48px;height:48px;border-radius:50%;border:3px solid #1e1e2e" />`
  ).join('')
  
  return `
    <div style="${darkBase};padding:32px;border-radius:12px;max-width:800px">
      <h1 style="font-size:24px;font-weight:700;color:#fff;margin-bottom:8px">${repo.name}</h1>
      <p style="color:#6c7086;margin-bottom:20px">${contributors.length} contributors</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">${avatars}</div>
    </div>
  `
}

export function renderReleaseTemplate(repo: RepoInfo, release: Release | null): string {
  if (!release) {
    return renderMinimalTemplate(repo)
  }
  
  return `
    <div style="${darkBase};padding:32px;border-radius:12px;max-width:800px">
      <h1 style="font-size:24px;font-weight:700;color:#fff">${repo.name}</h1>
      <div style="margin-top:20px;padding:20px;background:linear-gradient(135deg,#1e1e2e,#313244);border-radius:12px;border:1px solid #45475a">
        <span style="color:#a6e3a1;font-family:monospace;font-size:14px">${release.tagName}</span>
        <p style="color:#cdd6e4;margin-top:8px">${release.name || release.tagName}</p>
        <p style="color:#6c7086;font-size:12px;margin-top:4px">${new Date(release.publishedAt).toLocaleDateString()}</p>
      </div>
    </div>
  `
}

export function renderStatsTemplate(repo: RepoInfo): string {
  return `
    <div style="${darkBase};padding:32px;border-radius:12px;max-width:800px">
      <h1 style="font-size:24px;font-weight:700;color:#fff">${repo.name}</h1>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:20px">
        <div style="padding:16px;background:linear-gradient(135deg,#1e1e2e,#313244);border-radius:12px;text-align:center;border:1px solid #45475a">
          <div style="font-size:28px;font-weight:700;color:#f9e2af">${repo.stars.toLocaleString()}</div>
          <div style="color:#6c7086;font-size:12px">Stars</div>
        </div>
        <div style="padding:16px;background:linear-gradient(135deg,#1e1e2e,#313244);border-radius:12px;text-align:center;border:1px solid #45475a">
          <div style="font-size:28px;font-weight:700;color:#f5c2e7">${repo.forks.toLocaleString()}</div>
          <div style="color:#6c7086;font-size:12px">Forks</div>
        </div>
        <div style="padding:16px;background:linear-gradient(135deg,#1e1e2e,#313244);border-radius:12px;text-align:center;border:1px solid #45475a">
          <div style="font-size:28px;font-weight:700;color:#89b4fa">${repo.watchers.toLocaleString()}</div>
          <div style="color:#6c7086;font-size:12px">Watchers</div>
        </div>
        <div style="padding:16px;background:linear-gradient(135deg,#1e1e2e,#313244);border-radius:12px;text-align:center;border:1px solid #45475a">
          <div style="font-size:28px;font-weight:700;color:#f38ba8">${repo.openIssues.toLocaleString()}</div>
          <div style="color:#6c7086;font-size:12px">Issues</div>
        </div>
      </div>
    </div>
  `
}

export function renderTechStackTemplate(repo: RepoInfo, languages: Language[]): string {
  const max = Math.max(...languages.map(l => l.bytes))
  const bars = languages.map(l => 
    `<div style="display:flex;align-items:center;gap:8px;margin-top:8px">
      <span style="width:80px;font-size:13px;color:#cdd6e4">${l.name}</span>
      <div style="flex:1;height:12px;background:#1e1e2e;border-radius:6px">
        <div style="height:100%;border-radius:6px;width:${(l.bytes/max)*100}%;background:${l.color}"></div>
      </div>
    </div>`
  ).join('')
  
  return `
    <div style="${darkBase};padding:32px;border-radius:12px;max-width:800px">
      <h1 style="font-size:24px;font-weight:700;color:#fff">${repo.name}</h1>
      <p style="color:#6c7086;margin-top:8px">${repo.description || 'No description'}</p>
      <div style="margin-top:20px">${bars}</div>
    </div>
  `
}

export function renderMinimalTemplate(repo: RepoInfo): string {
  return `
    <div style="${darkBase};padding:32px;border-radius:12px;max-width:800px">
      <h1 style="font-size:24px;font-weight:700;color:#fff">${repo.name}</h1>
      <p style="color:#6c7086;margin-top:8px">${repo.description || 'No description'}</p>
    </div>
  `
}