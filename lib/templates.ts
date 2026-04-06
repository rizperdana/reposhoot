import { RepoInfo, Contributor, Release, Language } from './github'

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

// Server-side rendering functions (return HTML strings)
export function renderReadmeTemplate(repo: RepoInfo, contributors: Contributor[]): string {
  const contributorAvatars = contributors.slice(0, 12).map(c => 
    `<img src="${c.avatarUrl}" style="width:48px;height:48px;border-radius:50%;margin-right:4px" />`
  ).join('')
  
  return `
    <div style="padding:32px;background:#fff;border-radius:8px;max-width:800px;font-family:system-ui,-apple-system,sans-serif">
      <h1 style="font-size:24px;font-weight:700">${repo.name}</h1>
      <p style="color:#666;margin-top:8px">${repo.description || 'No description'}</p>
      <div style="display:flex;gap:16px;margin-top:16px;font-size:14px">
        <span>⭐ ${repo.stars.toLocaleString()}</span>
        <span>🍴 ${repo.forks.toLocaleString()}</span>
        <span>👁️ ${repo.watchers.toLocaleString()}</span>
        <span>📮 ${repo.openIssues.toLocaleString()}</span>
      </div>
      <div style="display:flex;gap:4px;margin-top:16px;flex-wrap:wrap">${contributorAvatars}</div>
    </div>
  `
}

export function renderContributorsTemplate(repo: RepoInfo, contributors: Contributor[]): string {
  const avatars = contributors.slice(0, 12).map((c: Contributor) => 
    `<img src="${c.avatarUrl}" style="width:48px;height:48px;border-radius:50%" />`
  ).join('')
  
  return `
    <div style="padding:32px;background:#fff;border-radius:8px;max-width:800px;font-family:system-ui">
      <h1 style="font-size:24px;font-weight:700">${repo.name}</h1>
      <p style="color:#666;margin-top:8px">${contributors.length} contributors</p>
      <div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap">${avatars}</div>
    </div>
  `
}

export function renderReleaseTemplate(repo: RepoInfo, release: Release | null): string {
  if (!release) {
    return renderMinimalTemplate(repo)
  }
  
  return `
    <div style="padding:32px;background:#fff;border-radius:8px;max-width:800px;font-family:system-ui">
      <h1 style="font-size:24px;font-weight:700">${repo.name}</h1>
      <div style="margin-top:16px;padding:16px;background:#f0fdf4;border-radius:8px">
        <span style="color:#15803d;font-family:monospace;font-size:14px">${release.tagName}</span>
        <p style="margin-top:8px">${release.name || release.tagName}</p>
        <p style="color:#666;font-size:12px;margin-top:4px">${new Date(release.publishedAt).toLocaleDateString()}</p>
      </div>
    </div>
  `
}

export function renderStatsTemplate(repo: RepoInfo): string {
  return `
    <div style="padding:32px;background:#fff;border-radius:8px;max-width:800px;font-family:system-ui">
      <h1 style="font-size:24px;font-weight:700">${repo.name}</h1>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:16px">
        <div style="padding:16px;background:#fefce8;border-radius:8px;text-align:center">
          <div style="font-size:32px;font-weight:700;color:#ca8a04">${repo.stars.toLocaleString()}</div>
          <div style="color:#666;font-size:14px">Stars</div>
        </div>
        <div style="padding:16px;background:#fff7ed;border-radius:8px;text-align:center">
          <div style="font-size:32px;font-weight:700;color:#c2410c">${repo.forks.toLocaleString()}</div>
          <div style="color:#666;font-size:14px">Forks</div>
        </div>
        <div style="padding:16px;background:#eff6ff;border-radius:8px;text-align:center">
          <div style="font-size:32px;font-weight:700;color:#1d4ed8">${repo.watchers.toLocaleString()}</div>
          <div style="color:#666;font-size:14px">Watchers</div>
        </div>
        <div style="padding:16px;background:#fef2f2;border-radius:8px;text-align:center">
          <div style="font-size:32px;font-weight:700;color:#dc2626">${repo.openIssues.toLocaleString()}</div>
          <div style="color:#666;font-size:14px">Issues</div>
        </div>
      </div>
    </div>
  `
}

export function renderTechStackTemplate(repo: RepoInfo, languages: Language[]): string {
  const max = Math.max(...languages.map(l => l.bytes))
  const bars = languages.map(l => 
    `<div style="display:flex;align-items:center;gap:8px;margin-top:8px">
      <span style="width:80px;font-size:14px">${l.name}</span>
      <div style="flex:1;height:16px;background:#e5e7eb;border-radius">
        <div style="height:100%;border-radius;width:${(l.bytes/max)*100}%;background:${l.color}"></div>
      </div>
    </div>`
  ).join('')
  
  return `
    <div style="padding:32px;background:#fff;border-radius:8px;max-width:800px;font-family:system-ui">
      <h1 style="font-size:24px;font-weight:700">${repo.name}</h1>
      <p style="color:#666;margin-top:8px">${repo.description || 'No description'}</p>
      <div style="margin-top:16px">${bars}</div>
    </div>
  `
}

export function renderMinimalTemplate(repo: RepoInfo): string {
  return `
    <div style="padding:32px;background:#fff;border-radius:8px;max-width:800px;font-family:system-ui">
      <h1 style="font-size:24px;font-weight:700">${repo.name}</h1>
      <p style="color:#666;margin-top:8px">${repo.description || 'No description'}</p>
    </div>
  `
}