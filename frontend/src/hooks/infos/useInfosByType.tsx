import { useQuery } from '@tanstack/react-query'
import { getInfoByType } from '../../api/infos'
import type { Info } from '../../types/infos'

export function useInfosByType(type: string, query?: string) {
  return useQuery<Info[]>({
    queryKey: ['info', query, type],
    queryFn: () => getInfoByType(type, query)
  })
}