import { useMemo } from 'react'
import { usePrompts } from '@/contexts/PromptsContext'
import { resolveStyle } from '@/utils/styles'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface OverviewPanelProps {
  styleIds: Set<string>
  lyricId: string | null
  onDeselectStyle: (id: string) => void
  onDeselectLyric: () => void
}

export function OverviewPanel({
  styleIds,
  lyricId,
  onDeselectStyle,
  onDeselectLyric,
}: OverviewPanelProps) {
  const { prompts } = usePrompts()
  const total = styleIds.size + (lyricId ? 1 : 0)

  const preview = useMemo(() => {
    if (!styleIds.size) return ''
    return [...styleIds]
      .map((id) => resolveStyle(id, prompts))
      .filter(Boolean)
      .join(', ')
  }, [styleIds, prompts])

  if (total === 0) {
    return (
      <Card className="px-5 py-5 min-h-[56px] items-center justify-center">
        <div className="text-[10px] tracking-wider text-dim text-center">
          SELECT AT LEAST 2 STYLES OR LYRICS
        </div>
      </Card>
    )
  }

  return (
    <Card className="px-5 py-5 min-h-[56px] gap-3">
      {styleIds.size > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] tracking-[0.12em] font-bold text-blue shrink-0">
            {'\u{1F39B}'} STYLE
          </span>
          {[...styleIds].map((sid) => {
            const p = prompts.find((x) => x.id === sid)
            return (
              <Badge
                key={sid}
                variant="outline"
                className="text-[10px] font-bold tracking-wider rounded-lg px-2 py-1 h-auto cursor-pointer bg-blue/[0.12] border-blue/30 text-blue"
                onClick={() => onDeselectStyle(sid)}
              >
                {p?.name || '?'}{' '}
                <span className="opacity-50 text-xs">{'\u2715'}</span>
              </Badge>
            )
          })}
        </div>
      )}
      {lyricId && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] tracking-[0.12em] font-bold text-green shrink-0">
            {'\u{1F3B5}'} LYRICS
          </span>
          <Badge
            variant="outline"
            className="text-[10px] font-bold tracking-wider rounded-lg px-2 py-1 h-auto cursor-pointer bg-green/10 border-green/25 text-green"
            onClick={onDeselectLyric}
          >
            {prompts.find((x) => x.id === lyricId)?.name || '?'}{' '}
            <span className="opacity-50 text-xs">{'\u2715'}</span>
          </Badge>
        </div>
      )}
      {total === 1 && (
        <div className="text-[10px] tracking-wider text-dim mt-1">
          SELECT 1 MORE TO CONTINUE
        </div>
      )}
      {preview && (
        <div className="text-[10px] text-white/30 leading-relaxed mt-1 truncate">
          {preview.slice(0, 120)}
          {preview.length > 120 ? '\u2026' : ''}
        </div>
      )}
    </Card>
  )
}
