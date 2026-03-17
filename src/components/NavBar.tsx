import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { ListMusic, Shuffle } from 'lucide-react'

interface NavBarProps {
  activeView: 'prompts' | 'merge'
  onViewChange: (view: 'prompts' | 'merge') => void
  onNewPrompt: () => void
}

export function NavBar({ activeView, onViewChange, onNewPrompt }: NavBarProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  /* ── Desktop: fixed left sidebar ─────────────────── */
  if (isDesktop) {
    return (
      <nav className="fixed left-0 top-0 bottom-0 w-[200px] bg-surface border-r border-border flex flex-col pt-8 px-3 pb-6 z-50">
        <div className="font-heading text-xl tracking-[0.1em] text-white/40 px-4 pb-6 border-b border-border mb-4">
          SUNO PROMPTS
        </div>

        <button
          onClick={() => onViewChange('prompts')}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg text-xs w-full min-h-[44px] transition-colors text-left',
            activeView === 'prompts'
              ? 'text-green bg-green/10 font-bold'
              : 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]'
          )}
        >
          <ListMusic className="size-5" />
          <span className="tracking-[0.12em] font-bold">PROMPTS</span>
        </button>

        <button
          onClick={() => onViewChange('merge')}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg text-xs w-full min-h-[44px] transition-colors text-left',
            activeView === 'merge'
              ? 'text-green bg-green/10 font-bold'
              : 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]'
          )}
        >
          <Shuffle className="size-5" />
          <span className="tracking-[0.12em] font-bold">MIX & MATCH</span>
        </button>

        <div className="flex-1" />

        <button
          onClick={onNewPrompt}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-xs w-full min-h-[44px] transition-colors text-left bg-green/10 text-green hover:bg-green/20 font-bold"
        >
          <span className="text-lg">+</span>
          <span className="tracking-[0.12em] font-bold">NEW PROMPT</span>
        </button>
      </nav>
    )
  }

  /* ── Mobile: fixed bottom tab bar with center + ──── */
  return (
    <nav
      className="fixed bottom-0 inset-x-0 bg-surface border-t border-border z-50 flex items-center"
      style={{
        height: `calc(var(--nav-h) + var(--safe-bot))`,
        paddingBottom: 'var(--safe-bot)',
      }}
    >
      <button
        onClick={() => onViewChange('prompts')}
        className={cn(
          'flex-1 flex flex-col items-center justify-center gap-1 transition-colors h-[var(--nav-h)]',
          activeView === 'prompts' ? 'text-green' : 'text-white/35'
        )}
      >
        <ListMusic className="size-5" />
        <span className="text-[9px] tracking-[0.1em] font-bold">PROMPTS</span>
      </button>

      <div className="relative flex items-center justify-center w-16 h-[var(--nav-h)]">
        <button
          onClick={onNewPrompt}
          className="absolute -top-5 bg-green text-black rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold shadow-[0_4px_16px_rgba(29,185,84,0.4)] active:scale-95 transition-transform"
        >
          +
        </button>
      </div>

      <button
        onClick={() => onViewChange('merge')}
        className={cn(
          'flex-1 flex flex-col items-center justify-center gap-1 transition-colors h-[var(--nav-h)]',
          activeView === 'merge' ? 'text-green' : 'text-white/35'
        )}
      >
        <Shuffle className="size-5" />
        <span className="text-[9px] tracking-[0.1em] font-bold">
          MIX & MATCH
        </span>
      </button>
    </nav>
  )
}
