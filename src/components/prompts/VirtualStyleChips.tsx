import { useState } from 'react'
import { usePrompts } from '@/contexts/PromptsContext'
import { resolveStyle, lineageRows } from '@/utils/styles'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface VirtualStyleChipsProps {
  promptId: string
  sourceIds: string[]
}

export function VirtualStyleChips({
  promptId,
  sourceIds,
}: VirtualStyleChipsProps) {
  const { prompts } = usePrompts()
  const [showResolved, setShowResolved] = useState(false)

  const resolved = resolveStyle(promptId, prompts)
  const lineage = lineageRows(promptId, prompts)

  return (
    <div>
      <div
        className="flex flex-wrap gap-2 my-2 cursor-pointer"
        onClick={() => setShowResolved(!showResolved)}
      >
        {sourceIds.map((sid) => {
          const src = prompts.find((x) => x.id === sid)
          return (
            <Badge
              key={sid}
              variant="outline"
              className={cn(
                'text-xs font-bold tracking-wider rounded-full px-3 py-1 h-auto',
                src
                  ? 'bg-blue/[0.12] border-blue/30 text-blue'
                  : 'bg-white/[0.05] border-white/10 text-dim line-through'
              )}
            >
              {src ? src.name : '[deleted]'}
            </Badge>
          )
        })}
        <Button
          variant="outline"
          size="xs"
          onClick={(e) => {
            e.stopPropagation()
            setShowResolved(!showResolved)
          }}
          className="text-[10px] tracking-wider font-bold text-dim border-white/10 rounded-lg px-2 py-1 h-auto min-h-[24px] bg-transparent ml-1"
        >
          {showResolved ? '\u25B4' : '{ }'}
        </Button>
      </div>

      {showResolved && (
        <div className="space-y-3 mt-3">
          <div className="text-xs text-white/50 leading-relaxed px-3 py-2 bg-black/20 rounded-lg break-words">
            {resolved || '(empty)'}
          </div>
          {lineage.length > 1 && (
            <div className="px-3 py-2 bg-black/20 rounded-lg border-l-2 border-blue/20">
              {lineage.map((row, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 mb-1 last:mb-0 text-[10px] text-white/40"
                >
                  <span
                    className="text-white/15 shrink-0"
                    dangerouslySetInnerHTML={{
                      __html: '&nbsp;'.repeat(row.depth * 4) + '\u2514\u2500',
                    }}
                  />
                  <span>{row.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
