import { useState, useEffect, useCallback } from 'react'
import { PromptsProvider, usePrompts } from '@/contexts/PromptsContext'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { NavBar } from '@/components/NavBar'
import { EditModal } from '@/components/modal/EditModal'
import { PromptsView } from '@/components/prompts/PromptsView'
import { MixMatchView } from '@/components/mixmatch/MixMatchView'

function AppContent() {
  const { prompts } = usePrompts()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const [activeView, setActiveView] = useState<'prompts' | 'merge'>('prompts')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleEditPrompt = useCallback((id: string | null) => {
    setEditingId(id)
    setModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
    setEditingId(null)
  }, [])

  useEffect(() => {
    if (!isDesktop) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalOpen) handleCloseModal()
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        handleEditPrompt(null)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isDesktop, modalOpen, handleCloseModal, handleEditPrompt])

  const editPrompt = editingId
    ? prompts.find((p) => p.id === editingId) || null
    : null

  const sidebarWidth = isDesktop ? 200 : 0

  return (
    <>
      <NavBar
        activeView={activeView}
        onViewChange={setActiveView}
        onNewPrompt={() => handleEditPrompt(null)}
      />

      {/* ── Main content shell ────────────────────────── */}
      <main
        className="mx-auto w-full"
        style={{
          maxWidth: isDesktop ? '680px' : '520px',
          marginLeft: isDesktop
            ? `calc(${sidebarWidth}px + (100% - ${sidebarWidth}px - 680px) / 2)`
            : 'auto',
          paddingLeft: 'var(--page-px)',
          paddingRight: 'var(--page-px)',
          paddingTop: isDesktop ? '32px' : '0',
          paddingBottom: isDesktop
            ? '80px'
            : 'calc(var(--nav-h) + var(--safe-bot) + 40px)',
        }}
      >
        {activeView === 'prompts' && (
          <PromptsView onEditPrompt={handleEditPrompt} />
        )}
        {activeView === 'merge' && <MixMatchView />}
      </main>

      {/* Edit/Create modal */}
      <EditModal
        open={modalOpen}
        editPrompt={editPrompt}
        onClose={handleCloseModal}
      />
    </>
  )
}

export default function App() {
  return (
    <PromptsProvider>
      <AppContent />
    </PromptsProvider>
  )
}
