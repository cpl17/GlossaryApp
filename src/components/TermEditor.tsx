import { useState } from 'react'
import { GlossaryReference, GlossaryTerm } from '../lib/glossary'
import { PlusIcon, TrashIcon } from './Icons'

const TERM_MAX_LENGTH = 120
const CONTENT_MAX_LENGTH = 4000

type TermEditorProps = {
  term: GlossaryTerm
  isNew: boolean
  onSave: (term: string, content: string, references: GlossaryReference[]) => Promise<void>
  onCancel: () => void
  isSaving?: boolean
}

function emptyReference(): GlossaryReference {
  return { label: '', url: '' }
}

export function TermEditor({
  term,
  isNew,
  onSave,
  onCancel,
  isSaving = false,
}: TermEditorProps) {
  const [termName, setTermName] = useState(term.term)
  const [content, setContent] = useState(term.content)
  const [references, setReferences] = useState<GlossaryReference[]>(
    term.references.length > 0 ? term.references : [],
  )

  function updateReference(index: number, field: keyof GlossaryReference, value: string) {
    setReferences((current) =>
      current.map((reference, referenceIndex) =>
        referenceIndex === index ? { ...reference, [field]: value } : reference,
      ),
    )
  }

  function addReference() {
    setReferences((current) => [...current, emptyReference()])
  }

  function removeReference(index: number) {
    setReferences((current) => current.filter((_, referenceIndex) => referenceIndex !== index))
  }

  async function handleSave() {
    const normalizedReferences = references
      .map((reference) => ({
        label: reference.label.trim(),
        url: reference.url.trim(),
      }))
      .filter((reference) => reference.label && reference.url)

    await onSave(termName.trim(), content.trim(), normalizedReferences)
  }

  return (
    <div className="term-editor">
      <div className="term-editor__header">
        <h1 className="term-editor__title">{isNew ? 'Add term' : `Edit ${term.term}`}</h1>
      </div>

      <div className="field-group">
        <label htmlFor="term-name">Term</label>
        <input
          id="term-name"
          type="text"
          value={termName}
          maxLength={TERM_MAX_LENGTH}
          onChange={(event) => setTermName(event.target.value)}
          disabled={!isNew}
        />
        <p className="helper">
          {termName.length}/{TERM_MAX_LENGTH}
        </p>
      </div>

      <div className="field-group">
        <label htmlFor="term-content">Notes</label>
        <textarea
          id="term-content"
          value={content}
          maxLength={CONTENT_MAX_LENGTH}
          rows={8}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write your glossary entry here..."
        />
        <p className="helper">
          {content.length}/{CONTENT_MAX_LENGTH}
        </p>
      </div>

      <section className="term-editor__references">
        <div className="term-editor__references-header">
          <h2 className="section-label">REFERENCES</h2>
          <button type="button" className="button-text" onClick={addReference}>
            <PlusIcon className="button-text__icon" />
            Add reference
          </button>
        </div>

        {references.length === 0 ? (
          <p className="helper">No references yet.</p>
        ) : (
          <ul className="reference-editor-list">
            {references.map((reference, index) => (
              <li key={index} className="reference-editor-row">
                <input
                  type="text"
                  value={reference.label}
                  placeholder="Label"
                  onChange={(event) => updateReference(index, 'label', event.target.value)}
                />
                <input
                  type="url"
                  value={reference.url}
                  placeholder="https://..."
                  onChange={(event) => updateReference(index, 'url', event.target.value)}
                />
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => removeReference(index)}
                  aria-label="Remove reference"
                >
                  <TrashIcon className="icon-button__icon" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="term-editor__actions">
        <button type="button" className="button-outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </button>
        <button
          type="button"
          className="button-primary"
          onClick={handleSave}
          disabled={isSaving || termName.trim().length === 0}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
