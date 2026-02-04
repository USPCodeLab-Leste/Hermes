import { useQuery } from '@tanstack/react-query'
import { getInfosCountByType } from '../../api/infos'

export function useInfosCountByType(type: string) {
  return useQuery<Record<string, number>>({
    queryKey: ['infos-count', type],
    queryFn: () => getInfosCountByType(type)
  })
}