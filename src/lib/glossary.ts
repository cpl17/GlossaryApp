import { supabase } from './supabase'

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

  const { data, error } = await supabase
    .from('glossary_terms')
    .select('id, term, content, updated_at')
    .ilike('term', normalizedTerm)
    .limit(1)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export async function saveTerm(
  termInput: string,
  contentInput: string,
): Promise<GlossaryTerm> {
  const term = termInput.trim()
  const content = contentInput.trim()

  const { data, error } = await supabase
    .from('glossary_terms')
    .upsert(
      {
        term,
        content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'term' },
    )
    .select('id, term, content, updated_at')
    .single()

  if (error) {
    throw error
  }

  return data
}
