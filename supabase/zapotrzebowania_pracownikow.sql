-- Uruchom w Supabase SQL Editor, jeśli tabela jeszcze nie istnieje.

create table if not exists public.zapotrzebowania_pracownikow (
  id uuid primary key default gen_random_uuid(),
  anonimowe_id text not null unique,
  slug_firmy text not null default '',
  odpowiedzi_ankiety jsonb not null,
  badania_pracodawcy jsonb not null default '[]'::jsonb,
  badania_prywatne jsonb not null default '[]'::jsonb,
  status text not null default 'oczekujące',
  created_at timestamptz not null default now()
);

alter table public.zapotrzebowania_pracownikow enable row level security;

create policy "anon_insert_zapotrzebowania"
  on public.zapotrzebowania_pracownikow
  for insert
  to anon
  with check (true);
