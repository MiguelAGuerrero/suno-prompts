export interface Section {
  label: string
  content: string
  fullBlock: string
}

export function parseSections(lyrics: string): Section[] {
  if (!lyrics) return []
  const regex = /\[([^\]\n]+)\]/g
  const matches: { label: string; index: number; fullLen: number }[] = []
  let m: RegExpExecArray | null
  while ((m = regex.exec(lyrics)) !== null) {
    matches.push({ label: m[1].trim(), index: m.index, fullLen: m[0].length })
  }
  return matches.map((match, i) => {
    const contentStart = match.index + match.fullLen
    const contentEnd =
      i < matches.length - 1 ? matches[i + 1].index : lyrics.length
    const content = lyrics.slice(contentStart, contentEnd).trim()
    return {
      label: match.label,
      content,
      fullBlock: `[${match.label}]\n${content}`,
    }
  })
}
