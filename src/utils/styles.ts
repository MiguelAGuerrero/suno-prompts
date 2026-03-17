import type { Prompt } from '../types'

export function resolveStyle(
  pid: string,
  prompts: Prompt[],
  visited: Set<string> = new Set()
): string {
  if (visited.has(pid)) return ''
  visited.add(pid)
  const p = prompts.find((x) => x.id === pid)
  if (!p) return ''
  if (!p.sourceIds || !p.sourceIds.length) return p.style || ''
  return p.sourceIds
    .map((id) => resolveStyle(id, prompts, new Set(visited)))
    .filter(Boolean)
    .join(', ')
}

export function wouldCycle(
  targetId: string,
  candidateId: string,
  prompts: Prompt[],
  visited: Set<string> = new Set()
): boolean {
  if (candidateId === targetId) return true
  if (visited.has(candidateId)) return false
  visited.add(candidateId)
  const p = prompts.find((x) => x.id === candidateId)
  if (!p?.sourceIds?.length) return false
  return p.sourceIds.some((sid) =>
    wouldCycle(targetId, sid, prompts, new Set(visited))
  )
}

export function depCount(id: string, prompts: Prompt[]): number {
  return prompts.filter((p) => (p.sourceIds || []).includes(id)).length
}

export interface LineageRow {
  depth: number
  name: string
}

export function lineageRows(
  pid: string,
  prompts: Prompt[],
  depth: number = 0,
  visited: Set<string> = new Set()
): LineageRow[] {
  if (depth > 4 || visited.has(pid)) return []
  visited.add(pid)
  const p = prompts.find((x) => x.id === pid)
  if (!p) return []
  const rows: LineageRow[] = []
  ;(p.sourceIds || []).forEach((sid) => {
    const src = prompts.find((x) => x.id === sid)
    rows.push({ depth, name: src ? src.name : '[deleted]' })
    rows.push(...lineageRows(sid, prompts, depth + 1, new Set(visited)))
  })
  return rows
}
