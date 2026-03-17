import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { Prompt } from '@/types'

interface MMCardProps {
  prompt: Prompt
  styleOn: boolean
  lyricOn: boolean
  hasStyle: boolean
  hasLyrics: boolean
  cyclic: boolean
  onToggleStyle: () => void
  onPickLyric: () => void
}

export function MMCard({
  prompt: p,
  styleOn,
  lyricOn,
  hasStyle,
  hasLyrics,
  cyclic,
  onToggleStyle,
  onPickLyric,
}: MMCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card
      className={cn(
        'transition-colors',
        styleOn && 'border-blue/45',
        lyricOn && 'border-green/45'
      )}
    >
      <CardHeader className="gap-3 py-3">
        <div className="flex-1 min-w-0">
          <div className="font-heading text-lg tracking-wider overflow-hidden text-ellipsis whitespace-nowrap">
            {p.pinned && (
              <span className="text-gold text-sm mr-1">{'\u2B50'}</span>
            )}
            {p.name || 'Untitled'}
          </div>
          {hasStyle && (
            <div className="text-[10px] text-dim mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
              {(p.style || '').slice(0, 72)}
              {(p.style || '').length > 72 ? '\u2026' : ''}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {hasStyle && (
            <Button
              variant="outline"
              size="icon-xs"
              onClick={onToggleStyle}
              disabled={cyclic && !styleOn}
              className={cn(
                'w-7 h-7 rounded-full border-2 text-[10px] font-bold transition-all',
                styleOn
                  ? 'bg-blue border-blue text-black'
                  : cyclic
                    ? 'border-white/20 opacity-30 cursor-not-allowed'
                    : 'border-white/20 hover:border-white/40'
              )}
              title="Toggle style"
            >
              S
            </Button>
          )}
          {hasLyrics && (
            <Button
              variant="outline"
              size="icon-xs"
              onClick={onPickLyric}
              className={cn(
                'w-7 h-7 rounded-full border-2 text-[10px] font-bold transition-all',
                lyricOn
                  ? 'bg-green border-green text-black'
                  : 'border-white/20 hover:border-white/40'
              )}
              title="Use these lyrics"
            >
              L
            </Button>
          )}
          <span
            onClick={() => setExpanded(!expanded)}
            className={cn(
              'text-xs text-dim cursor-pointer p-1 shrink-0 transition-transform duration-200 leading-none',
              expanded && 'rotate-90'
            )}
          >
            {'\u25B6'}
          </span>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          <Separator className="mb-3" />
          <div className="text-xs leading-relaxed text-white/60 whitespace-pre-wrap max-h-[200px] overflow-y-auto">
            {hasStyle && (
              <div className={hasLyrics ? 'mb-3' : ''}>
                <span className="block text-[10px] tracking-[0.12em] font-bold text-blue mb-1">
                  {'\u{1F39B}'} STYLE
                </span>
                {p.style}
              </div>
            )}
            {hasLyrics && (
              <div>
                <span className="block text-[10px] tracking-[0.12em] font-bold text-green mb-1">
                  {'\u{1F3B5}'} LYRICS
                </span>
                {p.lyrics}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
