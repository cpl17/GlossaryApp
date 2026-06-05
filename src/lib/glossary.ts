import { invoke } from '@tauri-apps/api/core'

export type GlossaryReference = {
  label: string
  url: string
}

export type GlossaryTerm = {
  id: string
  term: string
  content: string
  references: GlossaryReference[]
  updated_at: string
}

export async function loadTerm(termInput: string): Promise<GlossaryTerm | null> {
  const normalizedTerm = termInput.trim()
  if (!normalizedTerm) {
    return null
  }

  return invoke<GlossaryTerm | null>('load_term', { termInput: normalizedTerm })
}

export async function searchTerms(query: string): Promise<GlossaryTerm[]> {
  const normalizedQuery = query.trim()
  if (!normalizedQuery) {
    return []
  }

  return invoke<GlossaryTerm[]>('search_terms', { query: normalizedQuery })
}

export async function saveTerm(
  termInput: string,
  contentInput: string,
  referencesInput: GlossaryReference[] = [],
): Promise<GlossaryTerm> {
  const term = termInput.trim()
  const content = contentInput.trim()

  return invoke<GlossaryTerm>('save_term', {
    termInput: term,
    contentInput: content,
    referencesInput,
  })
}

export async function deleteTerm(termInput: string): Promise<void> {
  const term = termInput.trim()
  if (!term) {
    throw new Error('Term cannot be empty.')
  }

  return invoke<void>('delete_term', { termInput: term })
}
