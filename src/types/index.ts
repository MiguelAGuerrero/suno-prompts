export interface Version {
  name: string
  style: string
  lyrics: string
  notes: string
  savedAt: number
}

export interface Prompt {
  id: string
  name: string
  style: string
  lyrics: string
  notes: string
  folderId: string | null
  pinned: boolean
  sectionStyles: Record<string, string>
  sourceIds?: string[]
  versions: Version[]
  createdAt: number
  updatedAt: number
}

export interface Folder {
  id: string
  name: string
}

export interface AppData {
  prompts: Prompt[]
  folders: Folder[]
  customTags: string[]
}

export interface TagGroup {
  id: string
  icon: string
  name: string
  tags: string[]
}

export interface SearchResult extends Prompt {
  _score?: number
  _hits?: Set<string>
}
