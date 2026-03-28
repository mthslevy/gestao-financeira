import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('seu-projeto')
)

const misconfigured = !isSupabaseConfigured

if (misconfigured) {
  console.error(
    '[Supabase] Configuração em falta ou inválida. Define VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env na raiz e reinicia o servidor de desenvolvimento.'
  )
}

if (import.meta.env.DEV && supabaseUrl && !misconfigured) {
  const redacted = supabaseUrl.replace(/^https?:\/\/([^.]+).*/, '$1…(supabase)')
  console.debug('[Supabase] URL:', redacted)
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)
