import { useState } from 'react'
import { loadTerm, saveTerm } from './lib/glossary'
import './App.css'

const TERM_MAX_LENGTH = 120
const CONTENT_MAX_LENGTH = 4000

function App() {
  const [term, setTerm] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('Enter a term and click Load.')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const canSubmit = term.trim().length > 0

  async function handleLoad() {
    const normalizedTerm = term.trim()
    if (!normalizedTerm) {
      setStatus('Please enter a term first.')
      return
    }

    setIsLoading(true)
    setStatus('Loading...')

    try {
      const result = await loadTerm(normalizedTerm)
      if (!result) {
        setContent('')
        setStatus('Not found. You can create this term now.')
        return
      }

      setTerm(result.term)
      setContent(result.content)
      setStatus(`Loaded "${result.term}".`)
    } catch {
      setStatus('Error loading term.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSave() {
    const normalizedTerm = term.trim()
    if (!normalizedTerm) {
      setStatus('Term cannot be empty.')
      return
    }

    setIsSaving(true)
    setStatus('Saving...')

    try {
      const result = await saveTerm(normalizedTerm, content)
      setTerm(result.term)
      setContent(result.content)
      setStatus(`Saved "${result.term}".`)
    } catch {
      setStatus('Error saving term. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="app">
      <section className="card">
        <h1>Glossary</h1>
        <p className="subtitle">Look up a term and write or update its notes.</p>

        <div className="field-group">
          <label htmlFor="term">Term</label>
          <input
            id="term"
            type="text"
            value={term}
            maxLength={TERM_MAX_LENGTH}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Example: xeriscaping"
          />
          <p className="helper">
            {term.length}/{TERM_MAX_LENGTH}
          </p>
        </div>

        <div className="actions">
          <button type="button" onClick={handleLoad} disabled={!canSubmit || isLoading}>
            {isLoading ? 'Loading...' : 'Load'}
          </button>
          <button type="button" onClick={handleSave} disabled={!canSubmit || isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div className="field-group">
          <label htmlFor="content">Definition / Notes</label>
          <textarea
            id="content"
            value={content}
            maxLength={CONTENT_MAX_LENGTH}
            onChange={(event) => setContent(event.target.value)}
            rows={12}
            placeholder="Write your glossary entry here..."
          />
          <p className="helper">
            {content.length}/{CONTENT_MAX_LENGTH}
          </p>
        </div>

        <p className="status">{status}</p>
      </section>
    </main>
  )
}

export default App
