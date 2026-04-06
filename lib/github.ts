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
  const data = await fetchGitHub<any>(`/repos/${owner}/${repo}/readme`)
  const rawContent = Buffer.from(data.content, 'base64').toString('utf-8')
  return decodeURIComponent(encodeURIComponent(rawContent))
}