import { useMediaQuery } from '@/hooks/useMediaQuery'

interface FABProps {
  onClick: () => void
}

export function FAB({ onClick }: FABProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <button
      onClick={onClick}
      className="fixed left-1/2 -translate-x-1/2 z-40 bg-green text-black rounded-full px-6 py-3 font-heading text-xl tracking-wider shadow-[0_6px_24px_rgba(29,185,84,0.4)] flex items-center gap-2 whitespace-nowrap active:scale-95 transition-transform"
      style={{
        bottom: isDesktop
          ? '32px'
          : 'calc(var(--nav-h) + var(--safe-bot) + 16px)',
        ...(isDesktop && { left: 'calc(440px + (100% - 440px) / 2)' }),
      }}
    >
      <span className="text-2xl leading-none">+</span>
      NEW PROMPT
    </button>
  )
}
