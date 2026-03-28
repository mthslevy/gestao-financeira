import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (
    email: string,
    password: string,
    options?: { firstName: string; lastName: string }
  ) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    let loadingFinished = false

    const finishLoading = () => {
      if (cancelled || loadingFinished) return
      loadingFinished = true
      setLoading(false)
    }

    const safetyTimer = window.setTimeout(() => {
      if (!cancelled) finishLoading()
    }, 15_000)

    supabase.auth
      .getSession()
      .then(({ data: { session: s } }) => {
        if (cancelled) return
        setSession(s)
        setUser(s?.user ?? null)
      })
      .catch(() => {
        if (cancelled) return
        setSession(null)
        setUser(null)
      })
      .finally(() => {
        window.clearTimeout(safetyTimer)
        if (!cancelled) finishLoading()
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setUser(s?.user ?? null)
    })

    return () => {
      cancelled = true
      window.clearTimeout(safetyTimer)
      subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error as Error | null }
  }, [])

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      options?: { firstName: string; lastName: string }
    ) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: options?.firstName?.trim() ?? '',
            last_name: options?.lastName?.trim() ?? '',
          },
        },
      })
      return { error: error as Error | null }
    },
    []
  )

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const value: AuthContextValue = { user, session, loading, signIn, signUp, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
