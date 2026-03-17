import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface FolderItemProps {
  icon: string
  label: string
  count: number
  active: boolean
  onClick: () => void
  onRename?: (name: string) => void
  onDelete?: () => void
  autoEdit?: boolean
}

export function FolderItem({
  icon,
  label,
  count,
  active,
  onClick,
  onRename,
  onDelete,
  autoEdit,
}: FolderItemProps) {
  const [editing, setEditing] = useState(autoEdit || false)
  const [editValue, setEditValue] = useState(label)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const commit = () => {
    const trimmed = editValue.trim() || 'Untitled'
    onRename?.(trimmed)
    setEditing(false)
  }

  if (editing && onRename) {
    return (
      <div className="flex items-center gap-3 px-4 py-2">
        <Input
          ref={inputRef}
          className="bg-white/[0.07] border-green text-white text-xs font-bold tracking-wider h-auto px-3 py-3 rounded-lg"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') inputRef.current?.blur()
            if (e.key === 'Escape') {
              if (editValue.trim() === '' || editValue.trim() === 'Untitled') {
                onDelete?.()
              }
              setEditing(false)
            }
          }}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-6 py-4 cursor-pointer transition-colors',
        active ? 'bg-green/10' : 'hover:bg-white/[0.03]'
      )}
      onClick={onClick}
    >
      <span className="text-base shrink-0">{icon}</span>
      <span
        className={cn(
          'flex-1 text-sm tracking-wider break-words',
          active && 'text-green font-bold'
        )}
        onClick={(e) => {
          if (onRename) {
            e.stopPropagation()
            setEditing(true)
            setEditValue(label)
          }
        }}
        style={onRename ? { cursor: 'text' } : undefined}
      >
        {label}
      </span>
      <Badge
        variant="secondary"
        className="text-[10px] text-dim bg-white/[0.07] rounded-full px-2 py-1 h-auto border-none"
      >
        {count}
      </Badge>
      {onDelete && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="text-xs text-red-400/40 hover:text-red-400/70 shrink-0"
        >
          {'\u2715'}
        </Button>
      )}
    </div>
  )
}
