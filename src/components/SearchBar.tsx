import { FormEvent, KeyboardEvent } from 'react'
import { SearchIcon } from './Icons'

type SearchBarProps = {
  value: string
  variant: 'centered' | 'compact'
  placeholder?: string
  onChange: (value: string) => void
  onSubmit: () => void
  autoFocus?: boolean
}

export function SearchBar({
  value,
  variant,
  placeholder = 'Search terms...',
  onChange,
  onSubmit,
  autoFocus = false,
}: SearchBarProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      onSubmit()
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form className={`search-bar search-bar--${variant}`} onSubmit={handleSubmit}>
      <SearchIcon className="search-bar__icon" />
      <input
        className="search-bar__input"
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        aria-label="Search terms"
      />
    </form>
  )
}
