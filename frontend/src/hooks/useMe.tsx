import type { UserMe } from '../types/user'
import { useAuth } from './auth/useAuth'

export function useMe() {
  const { user, loading, error } = useAuth()

  return {
    data: user as UserMe | null,
    isLoading: loading,
    error,
  }
}
