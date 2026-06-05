import { GlossaryTerm } from '../lib/glossary'

type SearchResultsProps = {
  results: GlossaryTerm[]
  onSelect: (term: GlossaryTerm) => void
}

export function SearchResults({ results, onSelect }: SearchResultsProps) {
  return (
    <ul className="search-results">
      {results.map((result) => (
        <li key={result.id}>
          <button type="button" className="search-results__item" onClick={() => onSelect(result)}>
            <span className="search-results__term">{result.term}</span>
            {result.content ? (
              <span className="search-results__preview">{result.content}</span>
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  )
}
