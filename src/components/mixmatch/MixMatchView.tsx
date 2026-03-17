import { useState, useMemo } from 'react'
import { usePrompts } from '@/contexts/PromptsContext'
import { resolveStyle, wouldCycle } from '@/utils/styles'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { OverviewPanel } from './OverviewPanel'
import { FilterPills } from './FilterPills'
import { MMCard } from './MMCard'
import { ResultsScreen } from './ResultsScreen'

function groupAlpha<T extends { name: string }>(items: T[]) {
  const sorted = [...items].sort((a, b) =>
    (a.name || '').localeCompare(b.name || '', undefined, {
      sensitivity: 'base',
    })
  )
  const groups: Record<string, T[]> = {}
  sorted.forEach((p) => {
    const letter = (p.name || '#').trim()[0].toUpperCase()
    const key = /[A-Z]/.test(letter) ? letter : '#'
    if (!groups[key]) groups[key] = []
    groups[key].push(p)
  })
  return groups
}

export function MixMatchView() {
  const { prompts } = usePrompts()

  const [styleIds, setStyleIds] = useState<Set<string>>(new Set())
  const [lyricId, setLyricId] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStyle, setFilterStyle] = useState(false)
  const [filterLyric, setFilterLyric] = useState(false)
  const [filterFav, setFilterFav] = useState(false)

  const totalSelected = styleIds.size + (lyricId ? 1 : 0)

  const assembledStyle = useMemo(
    () =>
      [...styleIds]
        .map((id) => prompts.find((p) => p.id === id))
        .filter((p) => p && p.style?.trim())
        .map((p) => resolveStyle(p!.id, prompts))
        .filter(Boolean)
        .join(', '),
    [styleIds, prompts]
  )

  const assembledLyrics = useMemo(() => {
    if (!lyricId) return ''
    const p = prompts.find((x) => x.id === lyricId)
    return p?.lyrics || ''
  }, [lyricId, prompts])

  const handleFilterToggle = (f: 'all' | 'style' | 'lyric' | 'fav') => {
    if (f === 'all') {
      setFilterStyle(false)
      setFilterLyric(false)
      setFilterFav(false)
    } else if (f === 'style') setFilterStyle(!filterStyle)
    else if (f === 'lyric') setFilterLyric(!filterLyric)
    else if (f === 'fav') setFilterFav(!filterFav)
  }

  const pool = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    let list = prompts.filter(
      (p) => (p.style && p.style.trim()) || (p.lyrics && p.lyrics.trim())
    )
    if (filterStyle) list = list.filter((p) => p.style?.trim())
    if (filterLyric) list = list.filter((p) => p.lyrics?.trim())
    if (filterFav) list = list.filter((p) => p.pinned)
    if (q)
      list = list.filter(
        (p) =>
          (p.name || '').toLowerCase().includes(q) ||
          (p.style || '').toLowerCase().includes(q) ||
          (p.lyrics || '').toLowerCase().includes(q)
      )
    return list
  }, [prompts, searchQuery, filterStyle, filterLyric, filterFav])

  const handleSaved = () => {
    setStyleIds(new Set())
    setLyricId(null)
    setShowResults(false)
    setSearchQuery('')
  }

  if (showResults) {
    return (
      <div className="space-y-8">
        <div className="pt-8 pb-2">
          <h1 className="font-heading text-4xl md:text-5xl tracking-wider leading-none">
            MIX & MATCH
          </h1>
        </div>
        <Separator />
        <ResultsScreen
          assembledStyle={assembledStyle}
          assembledLyrics={assembledLyrics}
          styleIds={styleIds}
          onBack={() => setShowResults(false)}
          onSaved={handleSaved}
        />
      </div>
    )
  }

  const groups = groupAlpha(pool)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pt-8 pb-2">
        <h1 className="font-heading text-4xl md:text-5xl tracking-wider leading-none">
          MIX & MATCH
        </h1>
      </div>

      <Separator />

      {/* Overview */}
      <OverviewPanel
        styleIds={styleIds}
        lyricId={lyricId}
        onDeselectStyle={(id) =>
          setStyleIds((prev) => {
            const next = new Set(prev)
            next.delete(id)
            return next
          })
        }
        onDeselectLyric={() => setLyricId(null)}
      />

      {/* Search */}
      <Input
        type="text"
        className="w-full bg-white/[0.05] border-white/10 rounded-xl px-4 py-3 h-auto text-white"
        placeholder="Search prompts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        autoComplete="off"
      />

      {/* Filters */}
      <FilterPills
        filterStyle={filterStyle}
        filterLyric={filterLyric}
        filterFav={filterFav}
        onToggle={handleFilterToggle}
      />

      {/* Cards */}
      {!pool.length ? (
        <div className="text-center py-16 px-4">
          <div className="text-5xl mb-4">{'\u{1F39B}'}</div>
          <div className="font-heading text-2xl tracking-wider text-white/25 mb-2">
            {searchQuery ? 'NO RESULTS' : 'NO PROMPTS'}
          </div>
          <div className="text-xs text-dim">
            {searchQuery
              ? 'Try a different search'
              : 'Add prompts with styles or lyrics first'}
          </div>
        </div>
      ) : (
        Object.keys(groups)
          .sort()
          .map((letter) => (
            <div key={letter}>
              <div className="pt-8 pb-3 font-heading text-xl tracking-wider text-white/90 leading-none">
                {letter}
              </div>
              <div className="space-y-4">
                {groups[letter].map((p) => {
                  const hasStyle = !!(p.style && p.style.trim())
                  const hasLyrics = !!(p.lyrics && p.lyrics.trim())
                  const sOn = styleIds.has(p.id)
                  const lOn = lyricId === p.id
                  const cyclic = sOn
                    ? false
                    : [...styleIds].some(
                        (sid) =>
                          wouldCycle(sid, p.id, prompts) ||
                          wouldCycle(p.id, sid, prompts)
                      )
                  return (
                    <MMCard
                      key={p.id}
                      prompt={p}
                      styleOn={sOn}
                      lyricOn={lOn}
                      hasStyle={hasStyle}
                      hasLyrics={hasLyrics}
                      cyclic={cyclic}
                      onToggleStyle={() =>
                        setStyleIds((prev) => {
                          const next = new Set(prev)
                          next.has(p.id) ? next.delete(p.id) : next.add(p.id)
                          return next
                        })
                      }
                      onPickLyric={() =>
                        setLyricId((prev) => (prev === p.id ? null : p.id))
                      }
                    />
                  )
                })}
              </div>
            </div>
          ))
      )}

      {/* Next button */}
      <div
        className="sticky bg-bg pt-4 border-t border-white/[0.06] z-10"
        style={{ bottom: 'calc(var(--nav-h) + var(--safe-bot) + 16px)' }}
      >
        <Button
          onClick={() => setShowResults(true)}
          disabled={totalSelected < 2}
          className={cn(
            'w-full rounded-xl py-4 h-auto font-heading text-2xl tracking-wider min-h-[48px] transition-colors border-none',
            totalSelected >= 2
              ? 'bg-green hover:bg-green/90 text-black'
              : 'bg-white/10 text-white/25'
          )}
        >
          NEXT {'\u2192'}
        </Button>
      </div>
    </div>
  )
}
