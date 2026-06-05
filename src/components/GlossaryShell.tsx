import { ReactNode } from 'react'
import { SearchBar } from './SearchBar'

type GlossaryShellProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  onSearchSubmit: () => void
  onTitleClick: () => void
  showCompactSearch: boolean
  children: ReactNode
}

export function GlossaryShell({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onTitleClick,
  showCompactSearch,
  children,
}: GlossaryShellProps) {
  return (
    <div className="glossary-shell">
      <header className="glossary-shell__header">
        <button type="button" className="glossary-shell__title" onClick={onTitleClick}>
          GLOSSARY
        </button>
        {showCompactSearch ? (
          <SearchBar
            variant="compact"
            value={searchValue}
            onChange={onSearchChange}
            onSubmit={onSearchSubmit}
          />
        ) : null}
      </header>
      <div className="glossary-shell__divider" />
      <main className="glossary-shell__main">{children}</main>
    </div>
  )
}
