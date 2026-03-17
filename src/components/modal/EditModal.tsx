import { useState, useEffect } from 'react'
import { usePrompts } from '@/contexts/PromptsContext'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'
import type { Prompt } from '@/types'

interface EditModalProps {
  open: boolean
  editPrompt: Prompt | null
  onClose: () => void
}

export function EditModal({
  open,
  editPrompt,
  onClose,
}: EditModalProps) {
  const { addPrompt, updatePrompt } = usePrompts()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isWide = useMediaQuery('(min-width: 1100px)')

  const [name, setName] = useState('')
  const [style, setStyle] = useState('')
  const [lyrics, setLyrics] = useState('')
  const canPaste = typeof navigator?.clipboard?.readText === 'function'

  useEffect(() => {
    if (!open) return
    if (editPrompt) {
      setName(editPrompt.name || '')
      setStyle(editPrompt.style || '')
      setLyrics(editPrompt.lyrics || '')
    } else {
      setName('')
      setStyle('')
      setLyrics('')
    }
  }, [open, editPrompt])

  const charLen = style.length
  const charClass =
    charLen > 500 ? 'text-[#ff5555] font-bold' : charLen > 415 ? 'text-orange' : 'text-dim'

  const handleStyleChange = (val: string) => {
    setStyle(val)
  }

  const pasteInto = async (setter: (v: string) => void, textareaId: string) => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) { setter(text); return }
    } catch { /* clipboard API unavailable or denied */ }
    // Fallback: focus + select so native paste menu appears on mobile
    const el = document.getElementById(textareaId) as HTMLTextAreaElement | null
    if (el) {
      el.focus()
      el.select()
    }
  }

  const handleSave = () => {
    if (editPrompt) {
      updatePrompt(editPrompt.id, {
        name: name.trim(),
        style: style.trim(),
        lyrics: lyrics.trim(),
      })
    } else {
      addPrompt({
        name: name.trim(),
        style: style.trim(),
        lyrics: lyrics.trim(),
        notes: '',
        folderId: null,
        sourceIds: undefined,
      })
    }
    onClose()
  }

  /* ── Shared form content ──────────────────────────── */
  const formContent = (
    <div className="space-y-8">
      {/* Name */}
      <div className="space-y-2">
        <label className="block text-[10px] tracking-[0.15em] font-bold text-green">
          NAME
        </label>
        <Input
          type="text"
          className="bg-black/40 border-white/[0.11] rounded-xl px-4 py-3 h-auto text-white"
          placeholder="e.g. Melancholic Pop Verse"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>

      {/* Style */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] tracking-[0.15em] font-bold text-blue">
            STYLE
          </label>
          <div className="flex gap-1.5">
            {canPaste && (
              <Button
                variant="outline"
                size="icon-xs"
                onClick={() => pasteInto(handleStyleChange, 'edit-style')}
                className="text-blue/60 border-blue/20 hover:border-blue/40"
                title="Paste from clipboard"
              >
                {'\u{1F4CB}'}
              </Button>
            )}
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => handleStyleChange('')}
              className="text-white/40 border-white/10 hover:border-white/25"
              title="Clear"
            >
              {'\u2715'}
            </Button>
          </div>
        </div>
        <Textarea
          id="edit-style"
          className="bg-black/40 border-white/[0.11] rounded-xl px-4 py-3 text-white leading-relaxed min-h-0"
          rows={3}
          placeholder="e.g. dreamy indie pop, reverb guitar, female vocals"
          value={style}
          onChange={(e) => handleStyleChange(e.target.value)}
        />
        <div className="flex justify-end">
          <span className={cn('text-[10px] transition-colors', charClass)}>
            {charLen} / 500
          </span>
        </div>
      </div>

      {/* Lyrics */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] tracking-[0.15em] font-bold text-green">
            LYRICS
          </label>
          <div className="flex gap-1.5">
            {canPaste && (
              <Button
                variant="outline"
                size="icon-xs"
                onClick={() => pasteInto(setLyrics, 'edit-lyrics')}
                className="text-green/60 border-green/20 hover:border-green/40"
                title="Paste from clipboard"
              >
                {'\u{1F4CB}'}
              </Button>
            )}
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => setLyrics('')}
              className="text-white/40 border-white/10 hover:border-white/25"
              title="Clear"
            >
              {'\u2715'}
            </Button>
          </div>
        </div>
        <Textarea
          id="edit-lyrics"
          className="bg-black/40 border-white/[0.11] rounded-xl px-4 py-3 text-white leading-relaxed min-h-0"
          rows={10}
          placeholder={'[Verse 1]\nLine 1\nLine 2\n\n[Chorus]\nLine 3'}
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
        />
      </div>
    </div>
  )

  /* ── Footer buttons ──────────────────────────────── */
  const footerContent = (
    <div
      className="flex gap-3 sticky bottom-0 bg-surface pt-4 border-t border-white/[0.06] mt-4"
      style={{ paddingBottom: `calc(24px + var(--safe-bot))` }}
    >
      <Button
        variant="outline"
        onClick={onClose}
        className="flex-1 bg-transparent text-dim border-white/10 rounded-xl py-4 h-auto text-xs tracking-wider min-h-[48px]"
      >
        CANCEL
      </Button>
      <Button
        onClick={handleSave}
        className="flex-[2] bg-green hover:bg-green/90 text-black rounded-xl py-4 h-auto font-heading text-2xl tracking-wider min-h-[48px] border-none"
      >
        SAVE
      </Button>
    </div>
  )

  /* ── Desktop: Dialog ─────────────────────────────── */
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose() }}>
        <DialogContent
          showCloseButton={false}
          className={cn(
            'bg-surface rounded-2xl max-h-[85vh] overflow-y-auto p-0',
            isWide ? 'sm:max-w-[620px]' : 'sm:max-w-[560px]'
          )}
          style={{ border: '1px solid rgba(255,255,255,0.09)' }}
        >
          <div className="px-6 pt-6">
            <DialogTitle className="font-heading text-3xl tracking-wider mb-6">
              {editPrompt ? 'EDIT PROMPT' : 'NEW PROMPT'}
            </DialogTitle>
            {formContent}
            {footerContent}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  /* ── Mobile: Sheet (bottom) ──────────────────────── */
  return (
    <Sheet open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose() }}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="bg-surface rounded-t-3xl max-h-[92vh] overflow-y-auto p-0 gap-0"
        style={{ border: '1px solid rgba(255,255,255,0.09)', borderBottom: 'none' }}
      >
        <div className="px-6 pt-3">
          {/* Drag handle */}
          <div className="w-10 h-1 bg-white/[0.13] rounded-sm mx-auto mb-4" />

          <SheetTitle className="font-heading text-3xl tracking-wider mb-6">
            {editPrompt ? 'EDIT PROMPT' : 'NEW PROMPT'}
          </SheetTitle>
          {formContent}
          {footerContent}
        </div>
      </SheetContent>
    </Sheet>
  )
}
