export function formatLastEdited(updatedAt: string): string {
  const date = new Date(updatedAt)
  if (Number.isNaN(date.getTime())) {
    return 'Unknown date'
  }

  return `Last edited ${date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`
}
