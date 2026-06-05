import { useState } from 'react'
import { EmptySearchState } from './components/EmptySearchState'
import { GlossaryShell } from './components/GlossaryShell'
import { SearchBar } from './components/SearchBar'
import { SearchResults } from './components/SearchResults'
import { TermDetail } from './components/TermDetail'
import { TermEditor } from './components/TermEditor'
import {
  deleteTerm,
  GlossaryReference,
  GlossaryTerm,
  saveTerm,
  searchTerms,
} from './lib/glossary'
import './App.css'

type View =
  | { kind: 'idle' }
  | { kind: 'searching'; query: string }
  | { kind: 'results'; query: string; results: GlossaryTerm[] }
  | { kind: 'notFound'; query: string }
  | { kind: 'detail'; term: GlossaryTerm }
  | { kind: 'editing'; term: GlossaryTerm; isNew: boolean }

function createDraftTerm(termName: string): GlossaryTerm {
  return {
    id: '',
    term: termName,
    content: '',
    references: [],
    updated_at: new Date().toISOString(),
  }
}

function App() {
  const [searchInput, setSearchInput] = useState('')
  const [view, setView] = useState<View>({ kind: 'idle' })
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const showCompactSearch = view.kind !== 'idle'

  async function handleSearchSubmit() {
    const query = searchInput.trim()
    if (!query) {
      return
    }

    setView({ kind: 'searching', query })

    try {
      const results = await searchTerms(query)
      if (results.length === 0) {
        setView({ kind: 'notFound', query })
        return
      }

      setView({ kind: 'results', query, results })
    } catch {
      setView({ kind: 'notFound', query })
    }
  }

  function handleReset() {
    setSearchInput('')
    setView({ kind: 'idle' })
  }

  function handleSelectResult(term: GlossaryTerm) {
    setView({ kind: 'detail', term })
  }

  function handleAddTerm() {
    if (view.kind !== 'notFound') {
      return
    }

    setView({
      kind: 'editing',
      term: createDraftTerm(view.query),
      isNew: true,
    })
  }

  function handleEditTerm() {
    if (view.kind !== 'detail') {
      return
    }

    setView({
      kind: 'editing',
      term: view.term,
      isNew: false,
    })
  }

  async function handleSaveTerm(
    termName: string,
    content: string,
    references: GlossaryReference[],
  ) {
    setIsSaving(true)

    try {
      const saved = await saveTerm(termName, content, references)
      setSearchInput(saved.term)
      setView({ kind: 'detail', term: saved })
    } finally {
      setIsSaving(false)
    }
  }

  function handleCancelEdit() {
    if (view.kind !== 'editing') {
      return
    }

    if (view.isNew) {
      setView({ kind: 'notFound', query: view.term.term })
      return
    }

    setView({ kind: 'detail', term: view.term })
  }

  async function handleDeleteTerm() {
    if (view.kind !== 'detail') {
      return
    }

    setIsDeleting(true)

    try {
      await deleteTerm(view.term.term)
      handleReset()
    } finally {
      setIsDeleting(false)
    }
  }

  function renderBody() {
    switch (view.kind) {
      case 'idle':
        return (
          <div className="idle-search">
            <SearchBar
              variant="centered"
              value={searchInput}
              onChange={setSearchInput}
              onSubmit={handleSearchSubmit}
              autoFocus
            />
            <p className="idle-search__helper">Search across all your terms</p>
          </div>
        )
      case 'searching':
        return <p className="status-message">Searching...</p>
      case 'results':
        return <SearchResults results={view.results} onSelect={handleSelectResult} />
      case 'notFound':
        return <EmptySearchState query={view.query} onAddTerm={handleAddTerm} />
      case 'detail':
        return (
          <TermDetail
            term={view.term}
            onEdit={handleEditTerm}
            onDelete={handleDeleteTerm}
            isDeleting={isDeleting}
          />
        )
      case 'editing':
        return (
          <TermEditor
            term={view.term}
            isNew={view.isNew}
            onSave={handleSaveTerm}
            onCancel={handleCancelEdit}
            isSaving={isSaving}
          />
        )
      default:
        return null
    }
  }

  return (
    <GlossaryShell
      searchValue={searchInput}
      onSearchChange={setSearchInput}
      onSearchSubmit={handleSearchSubmit}
      onTitleClick={handleReset}
      showCompactSearch={showCompactSearch}
    >
      {renderBody()}
    </GlossaryShell>
  )
}

export default App
