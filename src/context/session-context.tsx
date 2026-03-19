'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name?: string | null
  role: string
  image?: string | null
}

interface SessionContextType {
  user: User | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  status: 'loading',
  signIn: async () => false,
  signOut: async () => {},
  refresh: async () => {}
})

export function useSession() {
  return useContext(SessionContext)
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')

  const refresh = async () => {
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      if (data.user) {
        setUser(data.user)
        setStatus('authenticated')
      } else {
        setUser(null)
        setStatus('unauthenticated')
      }
    } catch {
      setUser(null)
      setStatus('unauthenticated')
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (res.ok && data.user) {
        setUser(data.user)
        setStatus('authenticated')
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    setUser(null)
    setStatus('unauthenticated')
  }

  return (
    <SessionContext.Provider value={{ user, status, signIn, signOut, refresh }}>
      {children}
    </SessionContext.Provider>
  )
}
