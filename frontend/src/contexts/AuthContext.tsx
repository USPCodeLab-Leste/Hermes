import { createContext, useMemo } from 'react'
import { auth } from '../services/auth'
import { useAuthState } from '../hooks/auth/useAuthState'
import type { UserMe } from '../types/user'

interface AuthContextData {
  user: UserMe | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [
    user,
    loading,
    error
  ] = useAuthState(auth);

  const value = useMemo(() => {
    return {
      user,
      isAuthenticated: !!user,
      loading,
      error,
    }
  }, [user, loading, error])

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}