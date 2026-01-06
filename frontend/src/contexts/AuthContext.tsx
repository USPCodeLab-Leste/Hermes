import { createContext, useState } from 'react'

interface AuthContextData {
  token: string | null
  isAuthenticated: boolean
  login(token: string): void
  logout(): void
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState(
    () => localStorage.getItem('token')
  )

  function login(token: string) {
    localStorage.setItem('token', token)
    setToken(token)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{ 
        token, 
        isAuthenticated: !!token, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}