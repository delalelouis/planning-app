create extension if not exists "pgcrypto";

create table if not exists public.planning_documents (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pricing_documents (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists planning_documents_updated_at on public.planning_documents;
create trigger planning_documents_updated_at
before update on public.planning_documents
for each row execute function public.handle_updated_at();

drop trigger if exists pricing_documents_updated_at on public.pricing_documents;
create trigger pricing_documents_updated_at
before update on public.pricing_documents
for each row execute function public.handle_updated_at();

alter table public.planning_documents enable row level security;
alter table public.pricing_documents enable row level security;

drop policy if exists "Users can read own planning" on public.planning_documents;
create policy "Users can read own planning"
on public.planning_documents
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own planning" on public.planning_documents;
create policy "Users can insert own planning"
on public.planning_documents
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own planning" on public.planning_documents;
create policy "Users can update own planning"
on public.planning_documents
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can read own pricing" on public.pricing_documents;
create policy "Users can read own pricing"
on public.pricing_documents
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own pricing" on public.pricing_documents;
create policy "Users can insert own pricing"
on public.pricing_documents
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own pricing" on public.pricing_documents;
create policy "Users can update own pricing"
on public.pricing_documents
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);