import { invoke } from '@tauri-apps/api/core'

export type GlossaryTerm = {
  id: string
  term: string
  content: string
  updated_at: string
}

export async function loadTerm(termInput: string): Promise<GlossaryTerm | null> {
  const normalizedTerm = termInput.trim()
  if (!normalizedTerm) {
    return null
  }

  return invoke<GlossaryTerm | null>('load_term', { termInput: normalizedTerm })
}

export async function saveTerm(
  termInput: string,
  contentInput: string,
): Promise<GlossaryTerm> {
  const term = termInput.trim()
  const content = contentInput.trim()

  return invoke<GlossaryTerm>('save_term', { termInput: term, contentInput: content })
}
