import { createContext } from 'react'
import { auth } from '../services/auth'
import { useAuthState } from '../hooks/useAuthState'

interface AuthContextData {
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [
    token,
    loading,
    error
  ] = useAuthState(auth);

  return (
    <AuthContext.Provider
      value={{ 
        token,
        isAuthenticated: !!token,
        loading,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}