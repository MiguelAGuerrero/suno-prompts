import type { Prompt, SearchResult } from '../types'

export function tokenize(q: string): string[] {
  return q
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0)
}

function fuzzyScore(hay: string, needle: string): number {
  if (hay.includes(needle)) return 3
  let hi = 0
  for (const c of needle) {
    hi = hay.indexOf(c, hi)
    if (hi === -1) return 0
    hi++
  }
  return 1
}

function scorePrompt(
  p: Prompt,
  tokens: string[],
  allPrompts: Prompt[]
): { score: number; hitTokens: Set<string> } {
  const sourceNames = (p.sourceIds || [])
    .map((id) => allPrompts.find((x) => x.id === id))
    .filter(Boolean)
    .map((x) => (x!.name || '').toLowerCase())
    .join(' ')

  const fields = [
    { text: (p.name || '').toLowerCase(), weight: 3 },
    { text: (p.style || '').toLowerCase(), weight: 2 },
    { text: (p.lyrics || '').toLowerCase(), weight: 1 },
    { text: (p.notes || '').toLowerCase(), weight: 1 },
    { text: sourceNames, weight: 2 },
  ]

  let total = 0
  const hits = new Set<string>()
  tokens.forEach((tok) => {
    let ts = 0
    fields.forEach((f) => {
      const s = fuzzyScore(f.text, tok)
      if (s > 0) {
        ts += s * f.weight
        hits.add(tok)
      }
    })
    total += ts
  })
  return { score: total, hitTokens: hits }
}

export function getFilteredPrompts(
  prompts: Prompt[],
  query: string,
  mode: 'or' | 'and',
  folderId: string | null
): SearchResult[] {
  let list = prompts
  if (folderId === '__pinned') list = prompts.filter((p) => p.pinned)
  else if (folderId) list = prompts.filter((p) => p.folderId === folderId)

  const tokens = tokenize(query)
  if (!tokens.length) {
    return [...list.filter((p) => p.pinned), ...list.filter((p) => !p.pinned)]
  }

  const scored = list.map((p) => {
    const { score, hitTokens } = scorePrompt(p, tokens, prompts)
    return { p, score, hitTokens }
  })

  const filtered = scored.filter(({ score, hitTokens }) => {
    if (!score) return false
    return mode === 'and' ? tokens.every((t) => hitTokens.has(t)) : true
  })

  filtered.sort(
    (a, b) =>
      b.score - a.score || (b.p.pinned ? 1 : 0) - (a.p.pinned ? 1 : 0)
  )

  return filtered.map((x) => ({
    ...x.p,
    _score: x.score,
    _hits: x.hitTokens,
  }))
}
