import { PromptCard } from './PromptCard'
import type { SearchResult } from '@/types'

interface PromptListProps {
  prompts: SearchResult[]
  expandedIds: Set<string>
  onToggleExpand: (id: string) => void
  onEdit: (id: string) => void
  isSearching: boolean
  searchTokens: string[]
}

function groupAlpha(items: SearchResult[]) {
  const sorted = [...items].sort((a, b) =>
    (a.name || '').localeCompare(b.name || '', undefined, {
      sensitivity: 'base',
    })
  )
  const groups: Record<string, SearchResult[]> = {}
  sorted.forEach((p) => {
    const letter = (p.name || '#').trim()[0].toUpperCase()
    const key = /[A-Z]/.test(letter) ? letter : '#'
    if (!groups[key]) groups[key] = []
    groups[key].push(p)
  })
  return groups
}

export function PromptList({
  prompts,
  expandedIds,
  onToggleExpand,
  onEdit,
  isSearching,
  searchTokens,
}: PromptListProps) {
  if (!prompts.length) {
    return (
      <div className="text-center py-16 px-4">
        <div className="text-5xl mb-4">{'\u{1F3B5}'}</div>
        <div className="font-heading text-2xl tracking-wider text-white/25 mb-2">
          {isSearching ? 'NO RESULTS' : 'NO PROMPTS'}
        </div>
        <div className="text-xs text-dim">
          {isSearching
            ? 'Try different terms or switch OR \u2194 AND'
            : 'Tap + to add your first prompt'}
        </div>
      </div>
    )
  }

  const pinned = prompts.filter((p) => p.pinned)
  const rest = prompts.filter((p) => !p.pinned)
  const groups = groupAlpha(rest)

  return (
    <div>
      {/* Pinned prompts */}
      {pinned.length > 0 && (
        <div className="space-y-4">
          {pinned.map((p) => (
            <PromptCard
              key={p.id}
              prompt={p}
              expanded={expandedIds.has(p.id)}
              onToggleExpand={() => onToggleExpand(p.id)}
              onEdit={() => onEdit(p.id)}
              isSearching={isSearching}
              searchTokens={searchTokens}
            />
          ))}
        </div>
      )}

      {/* Alpha-grouped prompts */}
      {Object.keys(groups)
        .sort()
        .map((letter) => (
          <div key={letter}>
            <div className="pt-8 pb-3 font-heading text-xl tracking-wider text-white/90 leading-none">
              {letter}
            </div>
            <div className="space-y-4">
              {groups[letter].map((p) => (
                <PromptCard
                  key={p.id}
                  prompt={p}
                  expanded={expandedIds.has(p.id)}
                  onToggleExpand={() => onToggleExpand(p.id)}
                  onEdit={() => onEdit(p.id)}
                  isSearching={isSearching}
                  searchTokens={searchTokens}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}
