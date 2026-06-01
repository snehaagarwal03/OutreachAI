import { env } from "@/lib/utils/env"

const GITHUB_API_BASE = "https://api.github.com"

export async function fetchGitHubProfile(
  username: string
): Promise<{
  success: boolean
  profile?: Record<string, unknown>
  repos?: Array<Record<string, unknown>>
  error?: string
}> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    }

    const profileRes = await fetch(`${GITHUB_API_BASE}/users/${username}`, {
      headers,
    })

    if (!profileRes.ok) {
      return {
        success: false,
        error: `GitHub API error: ${profileRes.status} ${profileRes.statusText}`,
      }
    }

    const profile = await profileRes.json()

    const reposRes = await fetch(
      `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=10`,
      { headers }
    )

    const repos = reposRes.ok ? await reposRes.json() : []

    return {
      success: true,
      profile,
      repos,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function fetchGitHubRepository(
  owner: string,
  repo: string
): Promise<{
  success: boolean
  repo?: Record<string, unknown>
  readme?: string
  error?: string
}> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    }

    const repoRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
      headers,
    })

    if (!repoRes.ok) {
      return {
        success: false,
        error: `GitHub API error: ${repoRes.status} ${repoRes.statusText}`,
      }
    }

    const repoData = await repoRes.json()

    let readme = ""
    try {
      const readmeRes = await fetch(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`,
        {
          headers: {
            ...headers,
            Accept: "application/vnd.github.v3.raw",
          },
        }
      )
      if (readmeRes.ok) {
        readme = await readmeRes.text()
      }
    } catch {
      // readme fetch is best effort
    }

    return {
      success: true,
      repo: repoData,
      readme,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export function extractGitHubUsernameOrRepo(url: string): {
  type: "user" | "repo"
  username: string
  repo?: string
} | null {
  const match = url.match(/github\.com\/([^\/]+)(?:\/([^\/]+))?/)
  if (!match) return null

  const [, username, repo] = match
  if (repo) {
    return { type: "repo", username, repo }
  }
  return { type: "user", username }
}
