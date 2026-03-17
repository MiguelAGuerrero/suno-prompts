import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { Prompt, Folder, AppData } from '@/types'
import { loadData, saveData } from '@/utils/storage'
import { resolveStyle } from '@/utils/styles'

// ─── Actions ──────────────────────────────────────────────────────────────

type Action =
  | { type: 'LOAD_DATA'; data: AppData }
  | { type: 'ADD_PROMPT'; prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'versions' | 'pinned' | 'sectionStyles'> }
  | { type: 'UPDATE_PROMPT'; id: string; data: Partial<Prompt> }
  | { type: 'DELETE_PROMPT'; id: string }
  | { type: 'DUPLICATE_PROMPT'; id: string }
  | { type: 'TOGGLE_PIN'; id: string }
  | { type: 'RESTORE_VERSION'; id: string; versionIndex: number }
  | { type: 'SAVE_SECTION_STYLE'; id: string; section: string; style: string }
  | { type: 'ADD_FOLDER'; folder: Folder }
  | { type: 'RENAME_FOLDER'; id: string; name: string }
  | { type: 'DELETE_FOLDER'; id: string }
  | { type: 'IMPORT_DATA'; data: AppData }
  | { type: 'ADD_CUSTOM_TAG'; tag: string }

// ─── Reducer ──────────────────────────────────────────────────────────────

function reducer(state: AppData, action: Action): AppData {
  switch (action.type) {
    case 'LOAD_DATA':
      return action.data

    case 'ADD_PROMPT': {
      const now = Date.now()
      const newPrompt: Prompt = {
        ...action.prompt,
        id: now.toString(),
        pinned: false,
        sectionStyles: {},
        versions: [],
        createdAt: now,
        updatedAt: now,
      }
      return { ...state, prompts: [newPrompt, ...state.prompts] }
    }

    case 'UPDATE_PROMPT': {
      const prompts = state.prompts.map((p) => {
        if (p.id !== action.id) return p
        // Push current state as version (max 5)
        const version = {
          name: p.name,
          style: p.style,
          lyrics: p.lyrics,
          notes: p.notes,
          savedAt: p.updatedAt || p.createdAt,
        }
        const versions = [version, ...(p.versions || [])].slice(0, 5)
        return { ...p, ...action.data, versions, updatedAt: Date.now() }
      })
      return { ...state, prompts }
    }

    case 'DELETE_PROMPT': {
      // Bake resolved style into dependents before deletion
      let prompts = state.prompts.map((p) => {
        if (!(p.sourceIds || []).includes(action.id)) return p
        const baked = resolveStyle(p.id, state.prompts)
        const newSources = (p.sourceIds || []).filter((s) => s !== action.id)
        return {
          ...p,
          style: baked,
          sourceIds: newSources.length ? newSources : undefined,
        }
      })
      prompts = prompts.filter((p) => p.id !== action.id)
      return { ...state, prompts }
    }

    case 'DUPLICATE_PROMPT': {
      const source = state.prompts.find((p) => p.id === action.id)
      if (!source) return state
      const now = Date.now()
      const dup: Prompt = {
        ...source,
        id: now.toString(),
        name: source.name + ' (copy)',
        pinned: false,
        versions: [],
        sourceIds: undefined,
        createdAt: now,
        updatedAt: now,
      }
      return { ...state, prompts: [dup, ...state.prompts] }
    }

    case 'TOGGLE_PIN': {
      const prompts = state.prompts.map((p) =>
        p.id === action.id ? { ...p, pinned: !p.pinned } : p
      )
      return { ...state, prompts }
    }

    case 'RESTORE_VERSION': {
      const prompts = state.prompts.map((p) => {
        if (p.id !== action.id) return p
        const v = p.versions[action.versionIndex]
        if (!v) return p
        const newVersions = [
          {
            name: p.name,
            style: p.style,
            lyrics: p.lyrics,
            notes: p.notes,
            savedAt: p.updatedAt || p.createdAt,
          },
          ...p.versions.filter((_, i) => i !== action.versionIndex),
        ].slice(0, 5)
        return {
          ...p,
          name: v.name || p.name,
          style: v.style || '',
          lyrics: v.lyrics || '',
          notes: v.notes || '',
          versions: newVersions,
          updatedAt: Date.now(),
        }
      })
      return { ...state, prompts }
    }

    case 'SAVE_SECTION_STYLE': {
      const prompts = state.prompts.map((p) => {
        if (p.id !== action.id) return p
        return {
          ...p,
          sectionStyles: {
            ...p.sectionStyles,
            [action.section]: action.style,
          },
          updatedAt: Date.now(),
        }
      })
      return { ...state, prompts }
    }

    case 'ADD_FOLDER':
      return { ...state, folders: [...state.folders, action.folder] }

    case 'RENAME_FOLDER': {
      const folders = state.folders.map((f) =>
        f.id === action.id ? { ...f, name: action.name } : f
      )
      return { ...state, folders }
    }

    case 'DELETE_FOLDER': {
      const folders = state.folders.filter((f) => f.id !== action.id)
      const prompts = state.prompts.map((p) =>
        p.folderId === action.id ? { ...p, folderId: null } : p
      )
      return { ...state, folders, prompts }
    }

    case 'IMPORT_DATA': {
      const existingIds = new Set(state.prompts.map((p) => p.id))
      const existingFolderIds = new Set(state.folders.map((f) => f.id))
      const newPrompts = (action.data.prompts || []).filter(
        (p) => !existingIds.has(p.id)
      )
      const newFolders = (action.data.folders || []).filter(
        (f) => !existingFolderIds.has(f.id)
      )
      const newTags = (action.data.customTags || []).filter(
        (t) => !state.customTags.includes(t)
      )
      return {
        prompts: [...newPrompts, ...state.prompts],
        folders: [...state.folders, ...newFolders],
        customTags: [...state.customTags, ...newTags],
      }
    }

    case 'ADD_CUSTOM_TAG': {
      if (state.customTags.includes(action.tag)) return state
      return { ...state, customTags: [...state.customTags, action.tag] }
    }

    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────

interface PromptsContextValue {
  prompts: Prompt[]
  folders: Folder[]
  customTags: string[]
  addPrompt: (data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'versions' | 'pinned' | 'sectionStyles'>) => void
  updatePrompt: (id: string, data: Partial<Prompt>) => void
  deletePrompt: (id: string) => void
  duplicatePrompt: (id: string) => void
  togglePin: (id: string) => void
  restoreVersion: (id: string, versionIndex: number) => void
  saveSectionStyle: (id: string, section: string, style: string) => void
  addFolder: () => string
  renameFolder: (id: string, name: string) => void
  deleteFolder: (id: string) => void
  importData: (data: AppData) => void
  addCustomTag: (tag: string) => void
}

const PromptsContext = createContext<PromptsContextValue | null>(null)

export function PromptsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, () => loadData())

  // Auto-persist on every state change
  useEffect(() => {
    saveData(state)
  }, [state])

  const addPrompt = useCallback(
    (data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'versions' | 'pinned' | 'sectionStyles'>) =>
      dispatch({ type: 'ADD_PROMPT', prompt: data }),
    []
  )
  const updatePrompt = useCallback(
    (id: string, data: Partial<Prompt>) =>
      dispatch({ type: 'UPDATE_PROMPT', id, data }),
    []
  )
  const deletePrompt = useCallback(
    (id: string) => dispatch({ type: 'DELETE_PROMPT', id }),
    []
  )
  const duplicatePrompt = useCallback(
    (id: string) => dispatch({ type: 'DUPLICATE_PROMPT', id }),
    []
  )
  const togglePin = useCallback(
    (id: string) => dispatch({ type: 'TOGGLE_PIN', id }),
    []
  )
  const restoreVersion = useCallback(
    (id: string, versionIndex: number) =>
      dispatch({ type: 'RESTORE_VERSION', id, versionIndex }),
    []
  )
  const saveSectionStyle = useCallback(
    (id: string, section: string, style: string) =>
      dispatch({ type: 'SAVE_SECTION_STYLE', id, section, style }),
    []
  )
  const addFolder = useCallback(() => {
    const id = Date.now().toString()
    dispatch({ type: 'ADD_FOLDER', folder: { id, name: 'Untitled' } })
    return id
  }, [])
  const renameFolder = useCallback(
    (id: string, name: string) =>
      dispatch({ type: 'RENAME_FOLDER', id, name }),
    []
  )
  const deleteFolder = useCallback(
    (id: string) => dispatch({ type: 'DELETE_FOLDER', id }),
    []
  )
  const importData = useCallback(
    (data: AppData) => dispatch({ type: 'IMPORT_DATA', data }),
    []
  )
  const addCustomTag = useCallback(
    (tag: string) => dispatch({ type: 'ADD_CUSTOM_TAG', tag }),
    []
  )

  return (
    <PromptsContext.Provider
      value={{
        ...state,
        addPrompt,
        updatePrompt,
        deletePrompt,
        duplicatePrompt,
        togglePin,
        restoreVersion,
        saveSectionStyle,
        addFolder,
        renameFolder,
        deleteFolder,
        importData,
        addCustomTag,
      }}
    >
      {children}
    </PromptsContext.Provider>
  )
}

export function usePrompts() {
  const ctx = useContext(PromptsContext)
  if (!ctx) throw new Error('usePrompts must be used within PromptsProvider')
  return ctx
}
