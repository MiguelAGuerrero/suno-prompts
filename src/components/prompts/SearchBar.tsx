import { useState, useCallback } from 'react'
import { tokenize } from '@/utils/search'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const HISTORY_KEY = 'suno-search-history'
const MAX_HISTORY = 3

function loadHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory(history: string[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)))
}

interface SearchBarProps {
  query: string
  onQueryChange: (q: string) => void
  mode: 'or' | 'and'
  onModeChange: (m: 'or' | 'and') => void
  resultCount: number
  allHitTokens: Set<string>
}

export function SearchBar({
  query,
  onQueryChange,
  mode,
  onModeChange,
  resultCount,
  allHitTokens,
}: SearchBarProps) {
  const tokens = tokenize(query)
  const hasTokens = tokens.length > 0
  const [history, setHistory] = useState<string[]>(loadHistory)

  const addToHistory = useCallback((q: string) => {
    const trimmed = q.trim()
    if (!trimmed) return
    setHistory((prev) => {
      const next = [trimmed, ...prev.filter((h) => h !== trimmed)].slice(0, MAX_HISTORY)
      saveHistory(next)
      return next
    })
  }, [])

  return (
    <div className="space-y-4">
      <Input
        type="search"
        className="w-full bg-white/[0.05] border-white/10 rounded-xl px-4 py-3 h-auto text-white"
        placeholder="e.g. dark orchestral, lo-fi sad..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') addToHistory(query)
        }}
        onBlur={() => addToHistory(query)}
        autoComplete="off"
      />

      {/* Recent searches (shown when not actively searching) */}
      {!hasTokens && history.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-dim tracking-wider">RECENT</span>
          {history.map((h, i) => (
            <Button
              key={i}
              variant="outline"
              size="xs"
              onClick={() => onQueryChange(h)}
              className="rounded-full px-2.5 text-[10px] tracking-wider text-white/50 border-white/10 hover:border-white/25"
            >
              {h}
            </Button>
          ))}
        </div>
      )}

      {hasTokens && (
        <div className="flex items-center gap-2 flex-wrap">
          {/* OR / AND toggle */}
          <div className="flex bg-white/[0.05] border border-white/10 rounded-lg overflow-hidden shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onModeChange('or')}
              className={cn(
                'px-3 py-2 h-auto min-h-[32px] text-[10px] tracking-[0.12em] font-bold rounded-none',
                mode === 'or' ? 'bg-green text-black' : 'text-dim'
              )}
            >
              OR
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onModeChange('and')}
              className={cn(
                'px-3 py-2 h-auto min-h-[32px] text-[10px] tracking-[0.12em] font-bold rounded-none',
                mode === 'and' ? 'bg-green text-black' : 'text-dim'
              )}
            >
              AND
            </Button>
          </div>

          {/* Token pills */}
          <div className="flex flex-wrap gap-2 flex-1">
            {tokens.map((t, i) => (
              <Badge
                key={i}
                variant="outline"
                className={cn(
                  'text-[10px] tracking-wider rounded-xl px-3 py-1 h-auto',
                  allHitTokens.has(t)
                    ? 'bg-green/[0.15] border-green/30 text-green'
                    : 'bg-white/[0.08] border-white/[0.12] text-white/60'
                )}
              >
                {t}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {hasTokens && resultCount > 0 && (
        <div className="text-[10px] text-dim tracking-wider">
          {resultCount} RESULT{resultCount !== 1 ? 'S' : ''} {'\u00B7'} SORTED
          BY RELEVANCE
        </div>
      )}
    </div>
  )
}
