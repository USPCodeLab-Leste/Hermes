import { useState } from 'react'
import type { AuthService } from '../services/auth'
import type { LoginPayload } from '../types/payloads'

export function useSignIn(auth: AuthService) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!auth || !auth.signIn) {
    throw new Error('Auth service is not available')
  }

  const signIn = async (data: LoginPayload): Promise<string> => {
    setLoading(true)
    setError(null)

    try {
      const result = await auth.signIn(data)
      setLoading(false)

      return result
    } catch (error: any) {
      setError(error.message)
      setLoading(false)

      throw error
    }
  }

  return [signIn, loading, error] as const
}