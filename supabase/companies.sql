-- Uruchom w Supabase SQL Editor, jeśli tabela jeszcze nie istnieje.

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  nazwa text not null,
  adres text not null,
  nip text not null,
  budzet numeric not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

alter table public.companies enable row level security;

create policy "companies_select_anon"
  on public.companies
  for select
  to anon, authenticated
  using (true);

create policy "companies_insert_anon"
  on public.companies
  for insert
  to anon, authenticated
  with check (true);

create policy "companies_update_anon"
  on public.companies
  for update
  to anon, authenticated
  using (true);

create policy "companies_delete_anon"
  on public.companies
  for delete
  to anon, authenticated
  using (true);
