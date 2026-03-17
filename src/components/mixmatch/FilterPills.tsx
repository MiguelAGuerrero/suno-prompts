import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface FilterPillsProps {
  filterStyle: boolean
  filterLyric: boolean
  filterFav: boolean
  onToggle: (filter: 'all' | 'style' | 'lyric' | 'fav') => void
}

export function FilterPills({
  filterStyle,
  filterLyric,
  filterFav,
  onToggle,
}: FilterPillsProps) {
  const noFilter = !filterStyle && !filterLyric && !filterFav

  const pill = (
    label: string,
    active: boolean,
    activeClass: string,
    filter: 'all' | 'style' | 'lyric' | 'fav'
  ) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onToggle(filter)}
      className={cn(
        'px-4 py-2 h-auto rounded-xl text-xs tracking-wider font-bold min-h-[32px] transition-all',
        active ? activeClass : 'border-white/10 text-dim'
      )}
    >
      {label}
    </Button>
  )

  return (
    <div className="flex gap-3 flex-wrap">
      {pill('ALL', noFilter, 'bg-white/[0.07] border-white/[0.18] text-white', 'all')}
      {pill(
        '\u{1F39B} STYLE',
        filterStyle,
        'bg-blue/[0.12] border-blue/30 text-blue',
        'style'
      )}
      {pill(
        '\u{1F3B5} LYRICS',
        filterLyric,
        'bg-green/[0.12] border-green/30 text-green',
        'lyric'
      )}
      {pill(
        '\u2B50 FAVORITES',
        filterFav,
        'bg-white/[0.07] border-white/[0.18] text-white',
        'fav'
      )}
    </div>
  )
}
