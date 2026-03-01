import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Este bloco vai avisar-te se o .env falhar
if (!supabaseUrl || supabaseUrl.includes('seu-projeto')) {
  const msg =
    "ALERTA: O site ainda está a tentar ligar a 'seu-projeto'. Verifica o ficheiro .env na RAIZ do projeto (não dentro de src) e reinicia o terminal (npm run dev)!"
  console.error(msg)
  if (typeof alert !== 'undefined') alert(msg)
}

// Para debug: no Console vês qual URL está a ser usada (sem expor a key)
if (supabaseUrl && typeof console !== 'undefined') {
  console.log(
    '[Supabase] URL em uso:',
    supabaseUrl.startsWith('http') ? supabaseUrl.replace(/https:\/\/([^.]+)\..*/, 'https://$1.supabase.co') : 'MISSING'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)
