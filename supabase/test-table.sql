-- Tabela de testes: cola no SQL Editor do Supabase (>_) e clica Run.
-- Se já tiveres a tabela "transactions" do schema completo, apaga-a primeiro: drop table if exists transactions;
create table transactions (
  id uuid default gen_random_uuid() primary key,
  description text,
  amount decimal(12,2),
  type text,
  created_at timestamp with time zone default now()
);
