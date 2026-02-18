import { createContext } from 'react'
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

  return (
    <AuthContext.Provider
      value={{ 
        user,
        isAuthenticated: !!user,
        loading,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}