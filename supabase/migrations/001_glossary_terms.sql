create table if not exists public.glossary_terms (
  id uuid primary key default gen_random_uuid(),
  term text not null,
  content text not null default '',
  updated_at timestamptz not null default now(),
  constraint glossary_terms_term_unique unique (term)
);

create index if not exists glossary_terms_term_lower_idx
  on public.glossary_terms (lower(term));
