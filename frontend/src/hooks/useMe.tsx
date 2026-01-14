import { useQuery } from '@tanstack/react-query'
import { getMe } from '../api/users'
import type { UserMe } from '../types/user'
import type { AuthService } from '../services/auth'

export function useMe(auth: AuthService) {
  return useQuery<UserMe>({
    queryKey: ['me'],
    enabled: !!auth.getToken(),
    queryFn: async () => {
      const token = auth.getToken()

      if (!token) {
        throw new Error('Não autenticado')
      }

      return await getMe(token)
    }
  })
}
