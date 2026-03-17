import { useState } from 'react'
import { usePrompts } from '@/contexts/PromptsContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Version } from '@/types'

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface VersionHistoryProps {
  promptId: string
  versions: Version[]
}

export function VersionHistory({ promptId, versions }: VersionHistoryProps) {
  const { restoreVersion } = usePrompts()
  const [showVersions, setShowVersions] = useState(false)

  if (!versions.length) return null

  return (
    <div>
      <Button
        variant="outline"
        onClick={() => setShowVersions(!showVersions)}
        className="w-full mt-2 bg-purple/[0.07] border-purple/[0.18] rounded-xl px-4 py-3 h-auto text-purple text-xs tracking-wider font-bold justify-between"
      >
        <span>
          {'\u{1F550}'} {versions.length} PREVIOUS VERSION
          {versions.length > 1 ? 'S' : ''}
        </span>
        <span>{showVersions ? '\u25B4' : '\u25BE'}</span>
      </Button>

      {showVersions && (
        <div className="mt-3 space-y-3">
          {versions.map((v, i) => (
            <Card
              key={i}
              className="bg-black/30 border-white/[0.07] rounded-xl px-4 py-3 flex-row items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-dim mb-0.5">
                  {fmtDate(v.savedAt)}
                </div>
                <div className="text-xs text-white/50 whitespace-nowrap overflow-hidden text-ellipsis">
                  {(v.style || v.name || '\u2014').slice(0, 60)}
                </div>
              </div>
              <Button
                variant="outline"
                size="xs"
                onClick={() => restoreVersion(promptId, i)}
                className="text-[10px] tracking-wider font-bold text-purple border-purple/25 rounded-lg px-3 py-1.5 h-auto min-h-[32px]"
              >
                RESTORE
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
