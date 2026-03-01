-- Copia e cola isto no SQL Editor (apaga tudo o que lá está).
-- Protege a tabela categories por utilizador (igual ao que fizeste em transactions).

-- 1. Adiciona a coluna user_id na tabela categories
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id);

-- 2. Ativa o RLS (Segurança) na tabela categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 3. Remove políticas antigas se existirem para evitar conflitos
DROP POLICY IF EXISTS "Users can only see their own categories" ON public.categories;
DROP POLICY IF EXISTS "Acesso total categorias" ON public.categories;

-- 4. Cria a regra de privacidade: só o dono vê/cria as suas categorias
CREATE POLICY "Acesso total categorias"
ON public.categories
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
