import { useState } from 'react'
import type { AuthService } from '../../services/auth'

export function useSignOut(auth: AuthService) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!auth || !auth.signOut) {
    throw new Error('Auth service is not available')
  }

  const signOut = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await auth.signOut()
      setLoading(false)

      return result
    } catch (error: any) {
      setError(error.message)
      setLoading(false)

      throw error
    }
  }

  return [signOut, loading, error] as const
}