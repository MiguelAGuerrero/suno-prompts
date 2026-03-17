import { useState } from 'react'
import { usePrompts } from '@/contexts/PromptsContext'
import { copyToClipboard } from '@/utils/clipboard'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface ResultsScreenProps {
  assembledStyle: string
  assembledLyrics: string
  styleIds: Set<string>
  onBack: () => void
  onSaved: () => void
}

export function ResultsScreen({
  assembledStyle,
  assembledLyrics,
  styleIds,
  onBack,
  onSaved,
}: ResultsScreenProps) {
  const { folders, addPrompt } = usePrompts()
  const [finalStyle, setFinalStyle] = useState(assembledStyle)
  const [copiedStyle, setCopiedStyle] = useState(false)
  const [copiedLyrics, setCopiedLyrics] = useState(false)
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [saveFolderId, setSaveFolderId] = useState('')

  const isEdited = finalStyle.trim() !== assembledStyle.trim()

  const handleCopyStyle = async () => {
    await copyToClipboard(finalStyle)
    setCopiedStyle(true)
    setTimeout(() => setCopiedStyle(false), 2000)
  }

  const handleCopyLyrics = async () => {
    await copyToClipboard(assembledLyrics)
    setCopiedLyrics(true)
    setTimeout(() => setCopiedLyrics(false), 2000)
  }

  const handleSaveClick = () => {
    if (!showSaveForm) {
      setShowSaveForm(true)
      return
    }
    addPrompt({
      name: saveName.trim() || 'Mixed Prompt',
      style: finalStyle,
      lyrics: assembledLyrics,
      notes: '',
      folderId: saveFolderId || null,
      sourceIds: isEdited ? undefined : [...styleIds],
    })
    onSaved()
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="text-[10px] tracking-wider text-dim p-2 h-auto"
      >
        {'\u2190'} BACK
      </Button>

      {/* Style */}
      <Card className="bg-blue/[0.06] border-blue/20 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] tracking-[0.15em] font-bold text-blue">
            STYLE
          </span>
          <Button
            variant="outline"
            size="xs"
            onClick={handleCopyStyle}
            className={cn(
              'text-[10px] tracking-wider font-bold rounded-lg px-3 py-1.5 h-auto min-h-[32px] transition-all',
              copiedStyle
                ? 'bg-green text-black border-green'
                : 'text-blue border-blue/30 bg-transparent'
            )}
          >
            {copiedStyle ? 'COPIED \u2713' : 'COPY'}
          </Button>
        </div>
        <Textarea
          className="bg-black/40 border-blue/25 rounded-xl px-4 py-3 text-white/85 leading-relaxed min-h-0"
          rows={4}
          value={finalStyle}
          onChange={(e) => setFinalStyle(e.target.value)}
        />
        <div className="flex justify-end mt-1">
          <span className="text-[10px] text-dim">
            {finalStyle.length} / 500
          </span>
        </div>
      </Card>

      {/* Lyrics */}
      {assembledLyrics ? (
        <Card className="bg-green/[0.04] border-green/[0.15] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] tracking-[0.15em] font-bold text-green">
              LYRICS
            </span>
            <Button
              variant="outline"
              size="xs"
              onClick={handleCopyLyrics}
              className={cn(
                'text-[10px] tracking-wider font-bold rounded-lg px-3 py-1.5 h-auto min-h-[32px] transition-all',
                copiedLyrics
                  ? 'bg-green text-black border-green'
                  : 'text-green border-green/30 bg-transparent'
              )}
            >
              {copiedLyrics ? 'COPIED \u2713' : 'COPY'}
            </Button>
          </div>
          <div className="text-xs leading-relaxed text-white/75 break-words whitespace-pre-wrap max-h-40 overflow-y-auto">
            {assembledLyrics}
          </div>
        </Card>
      ) : (
        <div className="text-xs text-dim text-center py-4">
          No lyrics selected
        </div>
      )}

      {/* Save form */}
      {showSaveForm && (
        <Card className="bg-black/40 border-white/10 p-4 space-y-4">
          <div>
            <div className="text-[10px] tracking-[0.14em] text-green font-bold mb-2">
              NAME
            </div>
            <Input
              type="text"
              className="bg-black/40 border-white/[0.11] rounded-xl px-4 py-3 h-auto text-white"
              placeholder="e.g. Dark Orchestral Hybrid"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <div className="text-[10px] tracking-[0.14em] text-green font-bold mb-2">
              FOLDER (OPTIONAL)
            </div>
            <select
              className="w-full bg-black/40 border border-white/[0.11] rounded-xl px-4 py-3 text-white outline-none"
              value={saveFolderId}
              onChange={(e) => setSaveFolderId(e.target.value)}
            >
              <option value="">No folder</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </Card>
      )}

      {/* Save button */}
      <div
        className="sticky bg-bg pt-4 border-t border-white/[0.06] z-10"
        style={{ bottom: 'calc(var(--nav-h) + var(--safe-bot) + 16px)' }}
      >
        <Button
          onClick={handleSaveClick}
          className="w-full bg-green hover:bg-green/90 text-black rounded-xl py-4 h-auto font-heading text-2xl tracking-wider min-h-[48px] border-none"
        >
          {showSaveForm ? 'CONFIRM SAVE' : 'SAVE AS PROMPT'}
        </Button>
      </div>
    </div>
  )
}
