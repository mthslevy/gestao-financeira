-- Execute este SQL no Supabase: SQL Editor > New query > Cole e rode.
-- Cria as tabelas e políticas para a gestão financeira.

-- Tabela de categorias (receita ou despesa)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('receita', 'despesa'))
);

-- Tabela de transações
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('receita', 'despesa')),
  description text not null,
  amount numeric not null check (amount > 0),
  category_id uuid not null references public.categories(id) on delete restrict,
  date date not null,
  created_at timestamptz not null default now()
);

-- Índices para consultas do relatório
create index if not exists idx_transactions_date on public.transactions(date);
create index if not exists idx_transactions_type_date on public.transactions(type, date);
create index if not exists idx_categories_type on public.categories(type);

-- Habilitar RLS (Row Level Security) – opcional
-- Se for usar autenticação depois, descomente e crie políticas por user_id.
-- alter table public.categories enable row level security;
-- alter table public.transactions enable row level security;

-- Políticas para acesso público (anon) – apenas para desenvolvimento
-- Em produção, use auth.uid() e políticas por usuário.
create policy "Permitir tudo em categories para anon"
  on public.categories for all
  to anon
  using (true)
  with check (true);

create policy "Permitir tudo em transactions para anon"
  on public.transactions for all
  to anon
  using (true)
  with check (true);
