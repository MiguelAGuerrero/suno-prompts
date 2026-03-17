import { useState } from 'react'
import { usePrompts } from '@/contexts/PromptsContext'
import { parseSections } from '@/utils/sections'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SectionsBlockProps {
  promptId: string
  lyrics: string
  sectionStyles: Record<string, string>
}

export function SectionsBlock({
  promptId,
  lyrics,
  sectionStyles,
}: SectionsBlockProps) {
  const { saveSectionStyle } = usePrompts()
  const sections = parseSections(lyrics)
  const [savedSections, setSavedSections] = useState<Set<string>>(new Set())
  const [localStyles, setLocalStyles] = useState<Record<string, string>>(
    sectionStyles || {}
  )

  if (!sections.length) return null

  const handleSave = (label: string) => {
    saveSectionStyle(promptId, label, localStyles[label] || '')
    setSavedSections((prev) => new Set([...prev, label]))
    setTimeout(() => {
      setSavedSections((prev) => {
        const next = new Set(prev)
        next.delete(label)
        return next
      })
    }, 2000)
  }

  return (
    <div>
      <div className="text-[10px] tracking-[0.15em] text-teal font-bold mb-3 mt-1">
        {'\u{1F3AF}'} {sections.length} SECTION
        {sections.length > 1 ? 'S' : ''} DETECTED
      </div>
      <div className="space-y-3">
        {sections.map((sec) => (
          <Card
            key={sec.label}
            className="bg-teal/[0.04] border-teal/[0.12] rounded-xl px-4 py-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge className="font-heading text-sm tracking-wider bg-teal/[0.15] text-teal rounded-lg px-3 py-1 h-auto border-none">
                {sec.label}
              </Badge>
            </div>
            <div className="text-xs text-white/45 leading-relaxed mb-3 whitespace-pre-wrap max-h-16 overflow-hidden">
              {sec.content.slice(0, 80)}
              {sec.content.length > 80 ? '\u2026' : ''}
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                className="flex-1 bg-black/35 border-teal/20 text-teal/90 text-xs rounded-lg px-3 py-2 h-auto placeholder:text-teal/25"
                placeholder="section style tags..."
                value={localStyles[sec.label] || ''}
                onChange={(e) =>
                  setLocalStyles((prev) => ({
                    ...prev,
                    [sec.label]: e.target.value,
                  }))
                }
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave(sec.label)}
                className={cn(
                  'text-[10px] tracking-wider font-bold text-teal border-teal/25 rounded-lg px-3 py-2 h-auto min-h-[32px] transition-all',
                  savedSections.has(sec.label) && 'bg-teal/[0.15]'
                )}
              >
                {savedSections.has(sec.label) ? 'SAVED \u2713' : 'SAVE'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
