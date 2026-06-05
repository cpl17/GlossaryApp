import { DocumentSearchIcon, PlusIcon } from './Icons'

type EmptySearchStateProps = {
  query: string
  onAddTerm: () => void
}

export function EmptySearchState({ query, onAddTerm }: EmptySearchStateProps) {
  return (
    <div className="empty-search">
      <div className="empty-search__icon-wrap">
        <DocumentSearchIcon className="empty-search__icon" />
      </div>
      <h2 className="empty-search__title">
        No results for <span className="term-pill">{query}</span>
      </h2>
      <p className="empty-search__subtitle">This term isn&apos;t in your glossary yet.</p>
      <button type="button" className="button-outline" onClick={onAddTerm}>
        <PlusIcon className="button-outline__icon" />
        Add term
      </button>
    </div>
  )
}
