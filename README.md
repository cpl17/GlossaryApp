# Glossary Web App MVP

A simple glossary app where you can:
- Enter a term and load its saved note.
- Create or update note content for that term.

## Tech stack
- React + Vite + TypeScript
- Supabase Postgres (`glossary_terms` table)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
3. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`.
4. Run the SQL migration in your Supabase project:
   - `supabase/migrations/001_glossary_terms.sql`

## Development
```bash
npm run dev
```

## Build
```bash
npm run build
```
