-- Migração: adicionar autenticação por utilizador (user_id) e RLS
-- Executa no SQL Editor do Supabase DEPOIS do schema.sql base.
-- Assim cada utilizador só vê as suas categorias e transações.
--
-- No Supabase: Authentication > Providers > Email deve estar ativado
-- para Login com email/senha funcionar.

-- 1. Adicionar coluna user_id às tabelas (permite NULL para dados existentes)
alter table public.categories
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.transactions
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- 2. Índices para filtrar por user_id
create index if not exists idx_categories_user_id on public.categories(user_id);
create index if not exists idx_transactions_user_id on public.transactions(user_id);

-- 3. Ativar RLS nas tabelas
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

-- 4. Remover políticas antigas (anon)
drop policy if exists "Permitir tudo em categories para anon" on public.categories;
drop policy if exists "Permitir tudo em transactions para anon" on public.transactions;

-- 5. Políticas para utilizadores autenticados: cada um vê só os seus dados
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

-- 6. (Opcional) Se tiveres linhas antigas sem user_id, podes apagá-las ou atribuir a um user.
-- delete from public.transactions where user_id is null;
-- delete from public.categories where user_id is null;
