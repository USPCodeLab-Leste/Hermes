import { useState } from 'react'
import type { RegisterPayload } from '../types/payloads'
import type { AuthService } from '../services/auth'

export function useRegister(auth: AuthService) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!auth || !auth.register) {
    throw new Error('Auth service is not available')
  }

  const register = async (data: RegisterPayload): Promise<{ message: string, uuid: string }> => {
    setLoading(true)
    setError(null)

    try {
      const result = await auth.register(data)
      setLoading(false)

      return result
    } catch (error: any) {
      setError(error.message)
      setLoading(false)

      throw error
    }
  }

  return [register, loading, error] as const
}