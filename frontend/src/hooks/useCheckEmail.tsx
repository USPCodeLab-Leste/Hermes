import { useState } from 'react'
import type { AuthService } from '../services/auth'

export function useCheckEmail(auth: AuthService) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!auth || !auth.checkEmail) {
    throw new Error('Auth service is not available')
  }

  const checkEmail = async (email: string): Promise<{ message: string }> => {
    setLoading(true)
    setError(null)

    try {
      const response = await auth.checkEmail(email)
      setLoading(false)
      
      return response
    } catch (error: any) {
      setError(error.message)
      setLoading(false)
      throw error
    }
  }

  return [checkEmail, loading, error] as const
}
