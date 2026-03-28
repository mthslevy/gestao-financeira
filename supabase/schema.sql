-- Schema seguro para NOVOS projetos no Supabase (SQL Editor).
-- Cada linha fica ligada a auth.users via user_id; RLS impede acesso cruzado.
--
-- Se a tua base já foi criada com a versão antiga (sem user_id / políticas anon amplas),
-- não voltes a correr este ficheiro inteiro: usa supabase/migration-auth.sql para migrar.

-- Tabela de categorias (receita ou despesa), por utilizador
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('receita', 'despesa'))
);

-- Tabela de transações, por utilizador
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('receita', 'despesa')),
  description text not null,
  amount numeric not null check (amount > 0),
  category_id uuid not null references public.categories(id) on delete restrict,
  date date not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_categories_user_id on public.categories(user_id);
create index if not exists idx_categories_type on public.categories(type);
create index if not exists idx_transactions_user_id on public.transactions(user_id);
create index if not exists idx_transactions_date on public.transactions(date);
create index if not exists idx_transactions_type_date on public.transactions(type, date);

alter table public.categories enable row level security;
alter table public.transactions enable row level security;

-- Remove políticas inseguras de versões antigas (anon com acesso total)
drop policy if exists "Permitir tudo em categories para anon" on public.categories;
drop policy if exists "Permitir tudo em transactions para anon" on public.transactions;
drop policy if exists "Utilizador vê e edita as suas categorias" on public.categories;
drop policy if exists "Utilizador vê e edita as suas transações" on public.transactions;
drop policy if exists "Acesso total categorias" on public.categories;
drop policy if exists "Users can only see their own categories" on public.categories;

-- Apenas utilizadores autenticados, só os próprios dados
create policy "Utilizador vê e edita as suas categorias"
  on public.categories for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Utilizador vê e edita as suas transações"
  on public.transactions for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
