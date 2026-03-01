import { useState } from 'react'
import type { AuthService } from '../../services/auth'
import type { LoginPayload } from '../../types/payloads'
import type { UserMe } from '../../types/user'
import type { HttpError } from '../../types/error'

export function useSignIn(auth: AuthService) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<HttpError | null>(null)
  const [user, setUser] = useState<UserMe| null>(null)

  if (!auth || !auth.signIn) {
    throw new Error('Auth service is not available')
  }

  const signIn = async (data: LoginPayload): Promise<UserMe> => {
    setLoading(true)
    setError(null)

    try {
      const result = await auth.signIn(data)
      setLoading(false)
      setUser(result)

      return result
    } catch (error: any) {
      const httpError = error as HttpError
      setError({ name: httpError.name, message: httpError.message, status: httpError.status })
      setLoading(false)

      throw error
    }
  }

  return [signIn, user, loading, error] as const
}