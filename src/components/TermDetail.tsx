import { openUrl } from '@tauri-apps/plugin-opener'
import { formatLastEdited } from '../lib/format'
import { GlossaryTerm } from '../lib/glossary'
import { ExternalLinkIcon, PencilIcon, TrashIcon, referenceIconForUrl } from './Icons'

type TermDetailProps = {
  term: GlossaryTerm
  onEdit: () => void
  onDelete: () => void
  isDeleting?: boolean
}

export function TermDetail({ term, onEdit, onDelete, isDeleting = false }: TermDetailProps) {
  async function handleOpenReference(url: string) {
    try {
      await openUrl(url)
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <article className="term-detail">
      <div className="term-detail__header">
        <h1 className="term-detail__title">{term.term}</h1>
        <button type="button" className="icon-button" onClick={onEdit} aria-label="Edit term">
          <PencilIcon className="icon-button__icon" />
        </button>
      </div>

      <section className="term-detail__section">
        <h2 className="section-label">NOTES</h2>
        {term.content ? (
          <p className="term-detail__notes">{term.content}</p>
        ) : (
          <p className="term-detail__notes term-detail__notes--empty">No notes yet.</p>
        )}
      </section>

      {term.references.length > 0 ? (
        <section className="term-detail__section">
          <h2 className="section-label">REFERENCES</h2>
          <ul className="reference-list">
            {term.references.map((reference, index) => {
              const ReferenceIcon = referenceIconForUrl(reference.url)
              return (
                <li key={`${reference.url}-${index}`}>
                  <button
                    type="button"
                    className="reference-card"
                    onClick={() => handleOpenReference(reference.url)}
                  >
                    <span className="reference-card__icon-wrap">
                      <ReferenceIcon className="reference-card__icon" />
                    </span>
                    <span className="reference-card__content">
                      <span className="reference-card__label">{reference.label}</span>
                      <span className="reference-card__url">{reference.url}</span>
                    </span>
                    <ExternalLinkIcon className="reference-card__external" />
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}

      <footer className="term-detail__footer">
        <span className="term-detail__edited">{formatLastEdited(term.updated_at)}</span>
        <button
          type="button"
          className="button-outline button-outline--danger"
          onClick={onDelete}
          disabled={isDeleting}
        >
          <TrashIcon className="button-outline__icon" />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </footer>
    </article>
  )
}
