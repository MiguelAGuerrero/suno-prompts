import Fuse, { type IFuseOptions } from 'fuse.js'
import type { Prompt, SearchResult } from '../types'

export function tokenize(q: string): string[] {
  return q
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0)
}

const fuseOptions: IFuseOptions<Prompt> = {
  keys: [
    { name: 'name', weight: 3 },
    { name: 'style', weight: 2 },
    { name: 'lyrics', weight: 1 },
    { name: 'notes', weight: 1 },
  ],
  threshold: 0.4,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
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

  const fuse = new Fuse(list, fuseOptions)

  // Search each token independently to support OR/AND logic
  const tokenResults = tokens.map((tok) => {
    const results = fuse.search(tok)
    const idSet = new Set(results.map((r) => r.item.id))
    const scoreMap = new Map(
      results.map((r) => [r.item.id, 1 - (r.score ?? 1)])
    )
    return { tok, idSet, scoreMap }
  })

  // Build per-prompt aggregation
  const promptMap = new Map<string, { prompt: Prompt; score: number; hits: Set<string> }>()

  for (const { tok, idSet, scoreMap } of tokenResults) {
    for (const id of idSet) {
      if (!promptMap.has(id)) {
        const prompt = list.find((p) => p.id === id)!
        promptMap.set(id, { prompt, score: 0, hits: new Set() })
      }
      const entry = promptMap.get(id)!
      entry.score += scoreMap.get(id) ?? 0
      entry.hits.add(tok)
    }
  }

  // Filter by mode
  let results = [...promptMap.values()]
  if (mode === 'and') {
    results = results.filter((r) => tokens.every((t) => r.hits.has(t)))
  }

  // Sort by score descending, then pinned
  results.sort(
    (a, b) =>
      b.score - a.score ||
      (b.prompt.pinned ? 1 : 0) - (a.prompt.pinned ? 1 : 0)
  )

  return results.map((r) => ({
    ...r.prompt,
    _score: r.score,
    _hits: r.hits,
  }))
}
