const GITHUB_API = 'https://api.github.com'

export interface RepoInfo {
  name: string
  description: string
  stars: number
  forks: number
  watchers: number
  openIssues: number
  language: string
  topics: string[]
  htmlUrl: string
  owner: string
  ownerAvatar: string
}

export interface Contributor {
  login: string
  avatarUrl: string
  contributions: number
  htmlUrl: string
}

export interface Release {
  tagName: string
  name: string
  body: string
  publishedAt: string
  htmlUrl: string
}

export interface Language {
  name: string
  bytes: number
  color: string
}

async function fetchGitHub<T>(path: string): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  })
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`)
  }
  return res.json()
}

export async function getRepoInfo(owner: string, repo: string): Promise<RepoInfo> {
  const data = await fetchGitHub<any>(`/repos/${owner}/${repo}`)
  return {
    name: data.name,
    description: data.description || '',
    stars: data.stargazers_count,
    forks: data.forks_count,
    watchers: data.watchers_count,
    openIssues: data.open_issues_count,
    language: data.language || 'Unknown',
    topics: data.topics || [],
    htmlUrl: data.html_url,
    owner: data.owner.login,
    ownerAvatar: data.owner.avatar_url,
  }
}

export async function getContributors(owner: string, repo: string): Promise<Contributor[]> {
  const data = await fetchGitHub<any[]>(`/repos/${owner}/${repo}/contributors`)
  return data.slice(0, 20).map((c) => ({
    login: c.login,
    avatarUrl: c.avatar_url,
    contributions: c.contributions,
    htmlUrl: c.html_url,
  }))
}

export async function getLatestRelease(owner: string, repo: string): Promise<Release | null> {
  try {
    const data = await fetchGitHub<any>(`/repos/${owner}/${repo}/releases/latest`)
    return {
      tagName: data.tag_name,
      name: data.name || data.tag_name,
      body: data.body || '',
      publishedAt: data.published_at,
      htmlUrl: data.html_url,
    }
  } catch {
    return null
  }
}

export async function getLanguages(owner: string, repo: string): Promise<Language[]> {
  const data = await fetchGitHub<Record<string, number>>(`/repos/${owner}/${repo}/languages`)
  const total = Object.values(data).reduce((a, b) => a + b, 0)
  const languageColors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    PHP: '#4F5D95',
  }
  return Object.entries(data)
    .map(([name, bytes]) => ({
      name,
      bytes,
      color: languageColors[name] || '#808080',
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 8)
}

export async function getReadme(owner: string, repo: string): Promise<string> {
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`)
    if (!res.ok) {
      const res2 = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`)
      if (!res2.ok) return ''
      return res2.text()
    }
    return res.text()
  } catch {
    return ''
  }
}

// Simple markdown to HTML converter
export function markdownToHtml(md: string): string {
  if (!md) return ''
  
  let html = md
    // Headers
    .replace(/^### (.*$)/gim, '<h3 style="font-size:18px;font-weight:600;margin:24px 0 12px;color:#fff">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size:22px;font-weight:700;margin:28px 0 14px;color:#fff">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="font-size:28px;font-weight:800;margin:32px 0 16px;color:#fff">$1</h1>')
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/gim, '<pre style="background:#1e1e2e;padding:16px;border-radius:8px;overflow-x:auto"><code style="color:#cdd6e4;font-size:13px;line-height:1.6">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code style="background:#1e1e2e;padding:2px 6px;border-radius:4px;font-size:13px;color:#f38ba8">$1</code>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight:700;color:#fab387">$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em style="color:#f5c2e7">$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#89b4fa;text-decoration:underline">$1</a>')
    // Lists
    .replace(/^\* (.*$)/gim, '<li style="margin:4px 0;color:#a6adc8">• $1</li>')
    .replace(/^- (.*$)/gim, '<li style="margin:4px 0;color:#a6adc8">• $1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li style="margin:4px 0;color:#a6adc8">$1. $2</li>')
    // Line breaks
    .replace(/\n\n/g, '</p><p style="margin:12px 0;color:#cdd6e4;line-height:1.7">')
    .replace(/\n/g, '<br>')
  
  return `<div style="color:#cdd6e4;line-height:1.7;font-size:14px;font-family:system-ui,-apple-system,sans-serif">${html}</div>`
}