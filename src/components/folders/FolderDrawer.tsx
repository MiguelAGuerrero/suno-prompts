import { useState, useRef } from 'react'
import { usePrompts } from '@/contexts/PromptsContext'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'
import { FolderItem } from './FolderItem'
import type { AppData } from '@/types'

interface FolderDrawerProps {
  open: boolean
  onClose: () => void
  activeFolderId: string | null
  onSelectFolder: (id: string | null) => void
}

export function FolderDrawer({
  open,
  onClose,
  activeFolderId,
  onSelectFolder,
}: FolderDrawerProps) {
  const {
    prompts,
    folders,
    customTags,
    addFolder,
    renameFolder,
    deleteFolder,
    importData,
  } = usePrompts()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newFolderId, setNewFolderId] = useState<string | null>(null)

  const allCount = prompts.length
  const pinnedCount = prompts.filter((p) => p.pinned).length

  const doExport = () => {
    const data = JSON.stringify(
      { prompts, folders, customTags },
      null,
      2
    )
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `suno-prompts-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    onClose()
  }

  const doImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const d = JSON.parse(evt.target?.result as string)
        if (!d.prompts || !Array.isArray(d.prompts))
          throw new Error('Invalid file')
        importData(d as AppData)
        onClose()
        const newCount = (d.prompts || []).length
        alert(`Import complete. ${newCount} prompts processed.`)
      } catch {
        alert("Could not read file. Make sure it's a valid Suno Prompts export.")
      }
    }
    reader.readAsText(file)
  }

  const handleAddFolder = () => {
    const id = addFolder()
    setNewFolderId(id)
  }

  const select = (fid: string | null) => {
    onSelectFolder(fid)
    if (!isDesktop) onClose()
  }

  const drawerContent = (
    <div className="flex flex-col h-full">
      {/* Scrollable folder list */}
      <div className="flex-1 overflow-y-auto py-2">
        <FolderItem
          icon={'\u{1F4CB}'}
          label="ALL PROMPTS"
          count={allCount}
          active={activeFolderId === null}
          onClick={() => select(null)}
        />
        <FolderItem
          icon={'\u2B50'}
          label="FAVORITES"
          count={pinnedCount}
          active={activeFolderId === '__pinned'}
          onClick={() => select('__pinned')}
        />
        {folders.map((f) => (
          <FolderItem
            key={f.id}
            icon={'\u{1F4C1}'}
            label={f.name}
            count={prompts.filter((p) => p.folderId === f.id).length}
            active={activeFolderId === f.id}
            onClick={() => select(f.id)}
            onRename={(name) => {
              renameFolder(f.id, name)
              setNewFolderId(null)
            }}
            onDelete={() => deleteFolder(f.id)}
            autoEdit={f.id === newFolderId}
          />
        ))}
      </div>

      {/* Add folder button */}
      <div className="px-4 py-3 border-t border-border shrink-0">
        <Button
          onClick={handleAddFolder}
          className="w-full bg-green hover:bg-green/90 text-black rounded-lg px-4 py-3 h-auto text-xs font-bold tracking-wider justify-start border-none"
        >
          + ADD FOLDER
        </Button>
      </div>

      {/* Export / Import */}
      <div className="flex gap-2 px-4 py-3 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={doExport}
          className="flex-1 bg-white/[0.06] border-white/10 text-white/55 rounded-lg px-3 py-3 h-auto min-h-[40px] text-[10px] tracking-wider font-bold"
        >
          {'\u2B07'} EXPORT
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 bg-white/[0.06] border-white/10 text-white/55 rounded-lg px-3 py-3 h-auto min-h-[40px] text-[10px] tracking-wider font-bold"
        >
          {'\u2B06'} IMPORT
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={doImport}
          className="hidden"
        />
      </div>
    </div>
  )

  // Desktop: fixed side panel
  if (isDesktop) {
    if (!open) return null
    return (
      <aside className="fixed left-[200px] top-0 bottom-0 w-[240px] bg-[#111] border-r border-border pt-8 z-[90] flex flex-col">
        {drawerContent}
      </aside>
    )
  }

  // Mobile: Sheet (slide-in drawer with overlay)
  return (
    <Sheet open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose() }}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className={cn(
          'w-[280px] bg-[#111] border-r border-white/10 p-0 gap-0',
        )}
        style={{ paddingTop: 'var(--safe-top)' }}
      >
        <SheetTitle className="sr-only">Folders</SheetTitle>
        {drawerContent}
      </SheetContent>
    </Sheet>
  )
}
