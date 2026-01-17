'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { User as SupabaseUser, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@/types/database'

interface AuthContextType {
  user: SupabaseUser | null
  profile: User | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<any>
  signUpWithEmail: (email: string, password: string, name: string) => Promise<any>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Timeout para evitar loading infinito (10 segundos)
const AUTH_TIMEOUT = 10000

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const initialized = useRef(false)
  
  // Criar cliente uma única vez - cast to any to avoid type inference issues
  const supabase = createClient()!

  const fetchProfile = useCallback(async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await (supabase as any)
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // Se for erro de "not found", retorna null (perfil não existe ainda)
        if (error.code === 'PGRST116') {
          return null
        }
        console.error('Error fetching profile:', error)
        return null
      }

      return data
    } catch (err) {
      console.error('Error in fetchProfile:', err)
      return null
    }
  }, [supabase])

  const createProfile = useCallback(async (userId: string, email: string, name: string): Promise<User | null> => {
    try {
      const { data, error } = await (supabase as any)
        .from('users')
        .insert({
          id: userId,
          email: email,
          full_name: name,
          plan: 'free',
          posts_remaining: 3,
        })
        .select()
        .single()

      if (error) {
        // Se já existe (race condition), buscar o existente
        if (error.code === '23505') {
          return await fetchProfile(userId)
        }
        console.error('Error creating profile:', error)
        return null
      }

      return data
    } catch (err) {
      console.error('Error in createProfile:', err)
      return null
    }
  }, [supabase, fetchProfile])

  // Função para fazer refresh do token
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        console.error('Error refreshing session:', error)
        // Se o refresh falhar, deslogar o usuário
        if (error.message.includes('refresh_token') || error.message.includes('expired')) {
          await signOut()
        }
        return
      }

      if (data.session) {
        setSession(data.session)
        setUser(data.session.user)
      }
    } catch (err) {
      console.error('Error in refreshSession:', err)
    }
  }, [supabase])

  const refreshProfile = useCallback(async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }, [user, fetchProfile])

  // Inicialização do auth
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    let timeoutId: NodeJS.Timeout

    const initAuth = async () => {
      try {
        // Timeout de segurança
        timeoutId = setTimeout(() => {
          console.warn('Auth initialization timeout')
          setLoading(false)
        }, AUTH_TIMEOUT)

        // Buscar sessão atual
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          clearTimeout(timeoutId)
          return
        }

        if (currentSession?.user) {
          setSession(currentSession)
          setUser(currentSession.user)
          
          // Buscar ou criar perfil
          let profileData = await fetchProfile(currentSession.user.id)
          
          if (!profileData) {
            profileData = await createProfile(
              currentSession.user.id,
              currentSession.user.email || '',
              currentSession.user.user_metadata?.full_name || 
              currentSession.user.email?.split('@')[0] || 
              'Usuário'
            )
          }
          
          setProfile(profileData)
        }

        clearTimeout(timeoutId)
        setLoading(false)
      } catch (err) {
        console.error('Error in initAuth:', err)
        clearTimeout(timeoutId)
        setLoading(false)
      }
    }

    initAuth()

    // Listener para mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, newSession: Session | null) => {
        console.log('Auth event:', event)

        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully')
          if (newSession) {
            setSession(newSession)
            setUser(newSession.user)
          }
          return
        }

        if (event === 'SIGNED_OUT') {
          setUser(null)
          setSession(null)
          setProfile(null)
          setLoading(false)
          return
        }

        if (newSession?.user) {
          setSession(newSession)
          setUser(newSession.user)
          
          // Buscar ou criar perfil apenas em SIGNED_IN
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            let profileData = await fetchProfile(newSession.user.id)
            
            if (!profileData && event === 'SIGNED_IN') {
              profileData = await createProfile(
                newSession.user.id,
                newSession.user.email || '',
                newSession.user.user_metadata?.full_name || 
                newSession.user.email?.split('@')[0] || 
                'Usuário'
              )
            }
            
            setProfile(profileData)
          }
        } else {
          setUser(null)
          setSession(null)
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    // Refresh automático do token a cada 10 minutos
    const refreshInterval = setInterval(() => {
      if (session) {
        refreshSession()
      }
    }, 10 * 60 * 1000) // 10 minutos

    return () => {
      subscription.unsubscribe()
      clearInterval(refreshInterval)
      clearTimeout(timeoutId)
    }
  }, [supabase, fetchProfile, createProfile, refreshSession])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  }

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return data
    } finally {
      // O onAuthStateChange vai cuidar de setar loading = false
    }
  }

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      
      // Se o usuário foi criado e confirmado automaticamente
      if (data.user && data.session) {
        const profileData = await createProfile(data.user.id, email, name)
        setProfile(profileData)
      }
      
      return data
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        profile,
        session,
        loading, 
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refreshProfile,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
