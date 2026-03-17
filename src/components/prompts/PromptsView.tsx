import { useState, useMemo } from 'react'
import { usePrompts } from '@/contexts/PromptsContext'
import { getFilteredPrompts, tokenize } from '@/utils/search'
import { SearchBar } from './SearchBar'
import { PromptList } from './PromptList'

interface PromptsViewProps {
  onEditPrompt: (id: string | null) => void
}

export function PromptsView({ onEditPrompt }: PromptsViewProps) {
  const { prompts } = usePrompts()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchMode, setSearchMode] = useState<'or' | 'and'>('or')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const filtered = useMemo(
    () => getFilteredPrompts(prompts, searchQuery, searchMode, null),
    [prompts, searchQuery, searchMode]
  )

  const tokens = tokenize(searchQuery)
  const isSearching = tokens.length > 0
  const allHitTokens = useMemo(() => {
    const hits = new Set<string>()
    filtered.forEach((p) => {
      if (p._hits) p._hits.forEach((h) => hits.add(h))
    })
    return hits
  }, [filtered])

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="pt-8 pb-2">
        <h1 className="font-heading text-4xl md:text-5xl tracking-[0.06em] leading-none">
          SUNO PROMPTS
        </h1>
      </div>

      {/* Search */}
      {prompts.length > 1 && (
        <SearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          mode={searchMode}
          onModeChange={setSearchMode}
          resultCount={isSearching ? filtered.length : 0}
          allHitTokens={allHitTokens}
        />
      )}

      {/* Prompt list */}
      <PromptList
        prompts={filtered}
        expandedIds={expandedIds}
        onToggleExpand={toggleExpand}
        onEdit={(id) => onEditPrompt(id)}
        isSearching={isSearching}
        searchTokens={tokens}
      />
    </div>
  )
}
