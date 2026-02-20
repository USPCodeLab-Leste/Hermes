import { useEffect, useState } from 'react'
import type { AuthService } from '../../services/auth'
import type { UserMe } from '../../types/user'

export function useAuthState(auth: AuthService) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<UserMe| null>(null)

  if (!auth || !auth.onAuthStateChanged) {
    throw new Error('Auth service is not available')
  }

  useEffect(() => {
    try {
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        setUser(currentUser)
        setLoading(false)
      })

      return unsubscribe
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }, [auth])

  return [user, loading, error] as const
}
