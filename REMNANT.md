# Glossary — original app context

This file preserves the makeup of the first version of this project before it was cleared for a fresh start. The rebuild target is a **native Mac app (Tauri) with local SQLite** — no web server, no Supabase.

---

## Purpose

A simple personal glossary:

- Enter a term and **load** its saved note (case-insensitive lookup).
- **Create or update** note content for that term.
- Show status messages for load/save/not-found/error states.

---

## Original stack (removed)

| Layer | Choice |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Backend | Supabase Postgres (`@supabase/supabase-js`) |
| Hosting model | Web app (`npm run dev` / static `dist/` deploy) |

### Original dependencies

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.106.2",
    "react": "^19.2.6",
    "react-dom": "^19.2.6"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.1",
    "typescript": "~6.0.2",
    "vite": "^8.0.12",
    "eslint": "^10.3.0"
  }
}
```

### Environment variables (Supabase — no longer needed)

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Data model

### Postgres schema (original)

```sql
create table if not exists public.glossary_terms (
  id uuid primary key default gen_random_uuid(),
  term text not null,
  content text not null default '',
  updated_at timestamptz not null default now(),
  constraint glossary_terms_term_unique unique (term)
);

create index if not exists glossary_terms_term_lower_idx
  on public.glossary_terms (lower(term));
```

### Suggested SQLite schema (for rebuild)

```sql
CREATE TABLE IF NOT EXISTS glossary_terms (
  id TEXT PRIMARY KEY,
  term TEXT NOT NULL UNIQUE COLLATE NOCASE,
  content TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS glossary_terms_term_lower_idx
  ON glossary_terms (lower(term));
```

Notes for SQLite:

- Use `COLLATE NOCASE` on `term` (or `lower(term)` in queries) to match the original case-insensitive lookup.
- Store `updated_at` as ISO 8601 text (`2026-06-05T12:00:00.000Z`).
- Generate `id` in Rust (`uuid` crate) or use a simple autoincrement if preferred.

---

## API layer (preserve this interface)

The UI talked to two functions in `src/lib/glossary.ts`. Keep the same shape in the rebuild; swap the implementation to Tauri `invoke()` → SQLite.

```typescript
export type GlossaryTerm = {
  id: string
  term: string
  content: string
  updated_at: string
}

export async function loadTerm(termInput: string): Promise<GlossaryTerm | null>
export async function saveTerm(termInput: string, contentInput: string): Promise<GlossaryTerm>
```

### Original behavior

**`loadTerm`**

- Trim input; return `null` if empty.
- Query `glossary_terms` with case-insensitive match on `term` (`.ilike('term', normalizedTerm)` in Supabase).
- Return first match or `null` (not found).

**`saveTerm`**

- Trim `term` and `content`.
- Upsert on `term` conflict; set `updated_at` to now.
- Return the saved row.

---

## UI behavior

Single-page layout (`App.tsx`):

| Element | Details |
|---|---|
| Term input | `maxLength={120}`, placeholder `"Example: xeriscaping"` |
| Content textarea | `maxLength={4000}`, 12 rows |
| Load button | Disabled when term empty or loading |
| Save button | Disabled when term empty or saving |
| Status line | User feedback for every action |
| Character counters | `{length}/{max}` under term and content |

### Status messages

- Default: `"Enter a term and click Load."`
- Empty term on load: `"Please enter a term first."`
- Loading: `"Loading..."`
- Not found: `"Not found. You can create this term now."` (clears content)
- Loaded: `Loaded "{term}".`
- Load error: `"Error loading term. Please check your Supabase config."`
- Saving: `"Saving..."`
- Saved: `Saved "{term}".`
- Save error: `"Error saving term. Please try again."`
- Empty term on save: `"Term cannot be empty."`

### Validation limits

```typescript
const TERM_MAX_LENGTH = 120
const CONTENT_MAX_LENGTH = 4000
```

### Visual design (light, minimal)

- Centered card, max width 720px, white on `#f8fafc` background.
- Blue primary buttons (`#2563eb`), rounded inputs, subtle shadow.
- Font stack: Inter, system UI fonts.

---

## Original file layout

```
glossary/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── .env.example
├── README.md
├── ISSUES.md
├── public/
│   └── icons.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── lib/
│       ├── glossary.ts    # loadTerm / saveTerm
│       └── supabase.ts    # Supabase client (threw if env missing)
└── supabase/
    └── migrations/
        └── 001_glossary_terms.sql
```

---

## Known issues (original)

- **Save failed in testing** — UI showed `"Error saving term"`. Likely Supabase RLS policies or migration not applied. Not investigated further before pivot.

---

## Rebuild direction

| Decision | Choice |
|---|---|
| Platform | macOS desktop app |
| Shell | Tauri v2 |
| UI | React + Vite + TypeScript (reuse patterns above) |
| Storage | Local SQLite via Tauri Rust commands |
| Prerequisites | Xcode Command Line Tools (`xcode-select --install`), Rust (`rustup`), Node |

### What to drop

- Supabase client and env vars
- `supabase/` migrations folder
- Web-server deployment model

### What to keep (conceptually)

- `GlossaryTerm` type and `loadTerm` / `saveTerm` API
- UI layout, limits, and status-message behavior
- Case-insensitive term lookup

### Suggested Tauri layout

```
glossary/
├── REMNANT.md          # this file
├── src/                # React frontend
├── src-tauri/          # Rust + SQLite
│   ├── src/
│   │   ├── lib.rs      # DB init, migrations
│   │   └── commands.rs # load_term, save_term
│   └── tauri.conf.json
├── package.json
└── vite.config.ts
```

SQLite file location: Tauri app data dir (e.g. `app_data_dir()/glossary.db`).

---

## Original `App.tsx` (reference)

```tsx
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
      setStatus('Error loading term. Please check your Supabase config.')
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
        {/* term input, load/save buttons, content textarea, status */}
      </section>
    </main>
  )
}
```

Update the load-error message in the rebuild to something like `"Error loading term."` (no Supabase reference).

---

*Archived: 2026-06-05. Repo cleared for Tauri + SQLite rebuild.*
