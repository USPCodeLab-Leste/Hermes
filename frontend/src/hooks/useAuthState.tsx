import { useEffect, useState } from 'react'
import type { AuthService } from '../services/auth'

export function useAuthState(auth: AuthService) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  if (!auth || !auth.onAuthStateChanged) {
    throw new Error('Auth service is not available')
  }

  useEffect(() => {
    try {
      const unsubscribe = auth.onAuthStateChanged(() => {
        setToken(auth.getToken())
        setLoading(false)
      })

      return unsubscribe
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }, [auth])

  return [token, loading, error] as const
}
