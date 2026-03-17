import { useState } from 'react'
import { DEFAULT_GROUPS } from '@/data/defaultTags'
import { usePrompts } from '@/contexts/PromptsContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { TagGroup } from '@/types'

interface TagPickerProps {
  activeTags: Set<string>
  onToggleTag: (tag: string) => void
  onAddCustomTag: (tag: string) => void
}

export function TagPicker({
  activeTags,
  onToggleTag,
  onAddCustomTag,
}: TagPickerProps) {
  const { prompts, customTags } = usePrompts()
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set())
  const [customInput, setCustomInput] = useState('')

  const groups: TagGroup[] = DEFAULT_GROUPS.map((g) => {
    if (g.id === 'custom') {
      const savedTags = new Set<string>()
      prompts.forEach((p) => {
        ;(p.style || '')
          .split(/[,.]/)
          .map((t) => t.trim().toLowerCase())
          .filter((t) => t.length > 1)
          .forEach((t) => savedTags.add(t))
      })
      const merged = [...new Set([...customTags, ...savedTags])].sort()
      return { ...g, tags: merged }
    }
    return g
  }).filter((g) => !(g.id === 'custom' && g.tags.length === 0))

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleAddCustom = () => {
    const t = customInput.trim().toLowerCase()
    if (!t) return
    onAddCustomTag(t)
    onToggleTag(t)
    setCustomInput('')
  }

  return (
    <div className="bg-black/25 border border-white/[0.07] rounded-xl p-4 space-y-3">
      {groups.map((g) => {
        const activeCount = g.tags.filter((t) => activeTags.has(t)).length
        const isOpen = openGroups.has(g.id)

        return (
          <div
            key={g.id}
            className="border border-white/[0.07] rounded-xl overflow-hidden"
          >
            {/* Group header toggle */}
            <Button
              variant="ghost"
              onClick={() => toggleGroup(g.id)}
              className="flex justify-between items-center w-full px-4 py-3 h-auto bg-white/[0.03] hover:bg-white/[0.05] rounded-none"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{g.icon}</span>
                <span className="text-[10px] tracking-[0.14em] font-bold text-white/65">
                  {g.name}
                </span>
                {activeCount > 0 && (
                  <span className="text-[10px] text-green tracking-wider">
                    {activeCount} ON
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-sm text-white/20 transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              >
                {'\u25BE'}
              </span>
            </Button>

            {/* Tag buttons */}
            {isOpen && (
              <div className="px-4 py-3">
                {g.tags.length === 0 ? (
                  <div className="text-xs text-dim">
                    No custom tags yet
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {g.tags.map((t) => (
                      <Button
                        key={t}
                        variant="outline"
                        size="sm"
                        onClick={() => onToggleTag(t)}
                        className={cn(
                          'rounded-full px-3 py-2 h-auto min-h-[32px] text-xs transition-all',
                          activeTags.has(t)
                            ? 'bg-green border-green text-black font-bold'
                            : 'bg-white/[0.07] border-white/[0.11] text-white/70'
                        )}
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Custom tag input */}
      <div className="flex gap-2 pt-2">
        <Input
          type="text"
          className="flex-1 bg-black/40 border-white/[0.11] rounded-lg px-3 py-3 h-auto text-white"
          placeholder="Add custom tag..."
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
        />
        <Button
          variant="outline"
          onClick={handleAddCustom}
          className="bg-white/[0.08] border-white/[0.12] rounded-lg px-4 py-3 h-auto text-white text-xs tracking-wider font-bold min-h-[44px]"
        >
          ADD
        </Button>
      </div>
    </div>
  )
}
