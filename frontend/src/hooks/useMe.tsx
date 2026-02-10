import { useQuery } from '@tanstack/react-query'
import { getMe } from '../api/users'
import type { UserMe } from '../types/user'

export function useMe() {
  return useQuery<UserMe>({
    queryKey: ['me'],
    enabled: !!localStorage.getItem('fake-cookie'),
    queryFn: async () => {
      return await getMe()
    }
  })
}
