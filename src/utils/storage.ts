import type { AppData } from '../types'

const STORAGE_KEY = 'suno-v5'

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const d = JSON.parse(raw || '{}')
    return {
      prompts: d.prompts || [],
      folders: d.folders || [],
      customTags: d.customTags || [],
    }
  } catch {
    return { prompts: [], folders: [], customTags: [] }
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        prompts: data.prompts,
        folders: data.folders,
        customTags: data.customTags,
      })
    )
  } catch {
    // quota exceeded — silently fail
  }
}
