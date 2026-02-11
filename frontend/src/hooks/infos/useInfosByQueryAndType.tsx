import { useQuery } from '@tanstack/react-query'
import { getInfoByTitleAndType } from '../../api/infos'
import type { Info } from '../../types/infos'

export function useInfosByQueryAndType(query: string, type: string) {
  return useQuery<Info[]>({
    queryKey: ['info', query, type],
    queryFn: () => getInfoByTitleAndType(query, type)
  })
}