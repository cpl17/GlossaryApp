type IconProps = {
  className?: string
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
      <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

export function DocumentSearchIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="3" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 8H14M8 11H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16.5" cy="16.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M19 19L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function PencilIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20H8L18.5 9.5C19.3284 8.67157 19.3284 7.32843 18.5 6.5L17.5 5.5C16.6716 4.67157 15.3284 4.67157 14.5 5.5L4 16V20Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M13.5 6.5L17.5 10.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 7H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 11V16M14 11V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M8 7L9 19H15L16 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 7V5H15V7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export function ExternalLinkIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 5H19V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 14L19 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M19 14V19H5V5H10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function GlobeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 4C9.5 7 8.5 9.5 8.5 12C8.5 14.5 9.5 17 12 20C14.5 17 15.5 14.5 15.5 12C15.5 9.5 14.5 7 12 4Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export function FileIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 4H14L18 8V20H8V4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 4V8H18" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export function GithubIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.594 2 12.253C2 16.782 4.865 20.671 8.839 21.98C9.339 22.074 9.5 21.76 9.5 21.49V19.803C6.671 20.38 6.078 18.645 6.078 18.645C5.563 17.418 4.8 17.105 4.8 17.105C3.77 16.465 4.878 16.478 4.878 16.478C6.022 16.556 6.609 17.652 6.609 17.652C7.625 19.207 9.109 18.77 9.563 18.55C9.633 17.933 9.878 17.52 10.153 17.28C7.953 17.034 5.64 16.158 5.64 12.253C5.64 11.08 6.05 10.12 6.639 9.37C6.556 9.128 6.253 8.08 6.714 6.746C6.714 6.746 7.656 6.47 9.489 7.73C10.294 7.52 11.139 7.415 12 7.415C12.861 7.415 13.706 7.52 14.511 7.73C16.344 6.47 17.286 6.746 17.286 6.746C17.747 8.08 17.444 9.128 17.361 9.37C17.95 10.12 18.36 11.08 18.36 12.253C18.36 16.17 16.039 17.034 13.831 17.272C14.181 17.57 14.494 18.15 14.494 19.033V21.49C14.494 21.76 14.655 22.078 15.161 21.98C19.14 20.671 22 16.782 22 12.253C22 6.594 17.523 2 12 2Z" />
    </svg>
  )
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

export function referenceIconForUrl(url: string) {
  const lower = url.toLowerCase()
  if (lower.includes('github.com')) {
    return GithubIcon
  }
  if (lower.includes('arxiv.org')) {
    return FileIcon
  }
  return GlobeIcon
}
