import { useState } from 'react'
import type { RegisterPayload } from '../../types/payloads'
import type { AuthService } from '../../services/auth'
import type { HttpError } from '../../types/error'
import type { RegisterResponse } from '../../types/responses'

export function useRegister(auth: AuthService) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<HttpError | null>(null)

  if (!auth || !auth.register) {
    throw new Error('Auth service is not available')
  }

  const register = async (data: RegisterPayload): Promise<RegisterResponse> => {
    setLoading(true)
    setError(null)

    try {
      const result = await auth.register(data)
      setLoading(false)

      return result
    } catch (error: unknown) {
      const httpError = error as HttpError
      setError({ name: httpError.name, message: httpError.message, status: httpError.status })
      setLoading(false)

      throw error
    }
  }

  return [register, loading, error] as const
}