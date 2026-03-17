import { useState, useCallback } from 'react'
import { usePrompts } from '@/contexts/PromptsContext'
import { resolveStyle, depCount } from '@/utils/styles'
import { copyToClipboard } from '@/utils/clipboard'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { VirtualStyleChips } from './VirtualStyleChips'
import { VersionHistory } from './VersionHistory'
import type { Prompt } from '@/types'

interface PromptCardProps {
  prompt: Prompt
  expanded: boolean
  onToggleExpand: () => void
  onEdit: () => void
  isSearching?: boolean
  searchTokens?: string[]
}

export function PromptCard({
  prompt: p,
  expanded,
  onToggleExpand,
  onEdit,
  isSearching,
  searchTokens,
}: PromptCardProps) {
  const { prompts, togglePin, deletePrompt, duplicatePrompt } =
    usePrompts()
  const [confirmDel, setConfirmDel] = useState(false)
  const [copiedStyle, setCopiedStyle] = useState(false)
  const [copiedLyrics, setCopiedLyrics] = useState(false)

  const isSong = !!(p.lyrics && p.lyrics.trim())
  const hasSources = !!(p.sourceIds && p.sourceIds.length)
  const deps = depCount(p.id, prompts)

  const hitCount =
    isSearching && (p as any)._hits ? [...(p as any)._hits].length : 0
  const totalTokens = searchTokens?.length || 0

  const handleCopyStyle = useCallback(async () => {
    const text = resolveStyle(p.id, prompts)
    await copyToClipboard(text)
    setCopiedStyle(true)
    setTimeout(() => setCopiedStyle(false), 2000)
  }, [p.id, prompts])

  const handleCopyLyrics = useCallback(async () => {
    await copyToClipboard(p.lyrics)
    setCopiedLyrics(true)
    setTimeout(() => setCopiedLyrics(false), 2000)
  }, [p.lyrics])

  const handleDelete = () => {
    deletePrompt(p.id)
    setConfirmDel(false)
  }

  return (
    <Card
      className={cn(
        p.pinned && 'border-gold/35 bg-gold/[0.02]',
        isSong
          ? 'border-l-[3px] border-l-green/40'
          : 'border-l-[3px] border-l-blue/40'
      )}
    >
      {/* ── Header ────────────────────────────────────────── */}
      <CardHeader className="gap-3">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => togglePin(p.id)}
          className={cn(
            'text-base shrink-0',
            p.pinned ? 'opacity-100' : 'opacity-30'
          )}
        >
          {'\u2B50'}
        </Button>

        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={onToggleExpand}
        >
          <div className="font-heading text-xl tracking-wider leading-none whitespace-nowrap overflow-hidden text-ellipsis">
            {p.name || 'Untitled'}
            {deps > 0 && (
              <Badge
                variant="secondary"
                className="text-[10px] tracking-wider text-dim bg-white/[0.05] rounded px-1.5 py-px ml-2 align-middle font-mono font-normal h-auto border-none"
              >
                used in {deps}
              </Badge>
            )}
          </div>
          {!expanded && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {(p.style || hasSources) && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={(e) => { e.stopPropagation(); handleCopyStyle() }}
                  className={cn(
                    'rounded-full px-2.5 text-[10px] tracking-wider font-bold transition-all',
                    copiedStyle
                      ? 'bg-green text-black border-green'
                      : 'bg-blue/[0.12] text-blue border-blue/25 hover:bg-blue/[0.2]'
                  )}
                >
                  {copiedStyle ? 'COPIED \u2713' : 'STYLE'}
                </Button>
              )}
              {isSong && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={(e) => { e.stopPropagation(); handleCopyLyrics() }}
                  className={cn(
                    'rounded-full px-2.5 text-[10px] tracking-wider font-bold transition-all',
                    copiedLyrics
                      ? 'bg-green text-black border-green'
                      : 'bg-green/[0.12] text-green border-green/25 hover:bg-green/[0.2]'
                  )}
                >
                  {copiedLyrics ? 'COPIED \u2713' : 'LYRICS'}
                </Button>
              )}
              {isSearching && hitCount > 0 && (
                <Badge className="text-[10px] tracking-wider font-bold bg-green/[0.15] text-green rounded-full px-2 py-0.5 h-auto border-none">
                  {hitCount}/{totalTokens} MATCH
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Expand chevron */}
        <div
          className={cn(
            'text-white/20 text-sm transition-transform duration-200 shrink-0 cursor-pointer',
            expanded && 'rotate-180'
          )}
          onClick={onToggleExpand}
        >
          {'\u25BE'}
        </div>
      </CardHeader>

      {/* ── Expanded body ─────────────────────────────────── */}
      {expanded && (
        <>
          <CardContent className="space-y-5">
            {/* ── Actions ──────────────────────────────────── */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onEdit}
                className="flex-1 bg-white/[0.07] text-white border-white/[0.12] rounded-xl py-2.5 h-auto text-xs tracking-wider font-bold min-h-[40px]"
              >
                {'\u270F\uFE0F'} EDIT
              </Button>
              <Button
                variant="outline"
                onClick={() => duplicatePrompt(p.id)}
                className="flex-1 bg-white/[0.07] text-white border-white/[0.12] rounded-xl py-2.5 h-auto text-xs tracking-wider font-bold min-h-[40px]"
              >
                DUPLICATE
              </Button>
              {confirmDel ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setConfirmDel(false)}
                    className="bg-transparent text-dim border-white/[0.08] rounded-xl px-3 py-2.5 h-auto text-xs min-h-[40px]"
                  >
                    CANCEL
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    className="bg-red-500/[0.18] text-[#ff6b6b] border border-red-500/[0.22] rounded-xl px-4 py-2.5 h-auto text-xs min-h-[40px]"
                  >
                    DELETE
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => setConfirmDel(true)}
                  className="text-red-400/50 hover:text-red-400/70 border border-red-500/10 rounded-xl px-3 py-2.5 h-auto text-base min-h-[40px]"
                >
                  {'\u{1F5D1}'}
                </Button>
              )}
            </div>

            <Separator />

            {/* Style field */}
            {(p.style || hasSources) && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] tracking-[0.15em] text-blue font-bold">
                    STYLE{hasSources ? ' \u2726' : ''}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyStyle}
                    className={cn(
                      'text-[10px] tracking-wider font-bold min-h-[40px] rounded-lg transition-all',
                      copiedStyle
                        ? 'bg-green text-black border-green'
                        : 'bg-white/[0.07] border-white/[0.12] text-white'
                    )}
                  >
                    {copiedStyle ? 'COPIED \u2713' : 'COPY STYLE'}
                  </Button>
                </div>
                {hasSources ? (
                  <VirtualStyleChips
                    promptId={p.id}
                    sourceIds={p.sourceIds!}
                  />
                ) : (
                  <div className="bg-black/30 rounded-xl px-4 py-3 text-xs text-white/75 leading-relaxed whitespace-pre-wrap break-words">
                    {p.style}
                  </div>
                )}
              </div>
            )}

            {/* Lyrics */}
            {isSong && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] tracking-[0.15em] text-green font-bold">
                    LYRICS
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLyrics}
                    className={cn(
                      'text-[10px] tracking-wider font-bold min-h-[40px] rounded-lg transition-all',
                      copiedLyrics
                        ? 'bg-green text-black border-green'
                        : 'bg-white/[0.07] border-white/[0.12] text-white'
                    )}
                  >
                    {copiedLyrics ? 'COPIED \u2713' : 'COPY LYRICS'}
                  </Button>
                </div>
                <div className="bg-black/30 rounded-xl px-4 py-3 text-xs text-white/75 leading-loose whitespace-pre-wrap break-words max-h-56 overflow-y-auto">
                  {p.lyrics}
                </div>
              </div>
            )}

            {/* Notes */}
            {p.notes && (
              <div>
                <div className="text-[10px] tracking-[0.15em] text-gold font-bold mb-3">
                  {'\u{1F4DD}'} NOTES
                </div>
                <div className="bg-gold/[0.04] border border-gold/10 rounded-xl px-4 py-3 text-xs text-gold/80 leading-relaxed whitespace-pre-wrap break-words">
                  {p.notes}
                </div>
              </div>
            )}

            {/* Versions */}
            <VersionHistory promptId={p.id} versions={p.versions || []} />
          </CardContent>

        </>
      )}
    </Card>
  )
}
