import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getInfosByTitle} from '../../api/infos'
import type { Info } from '../../types/infos'

export function useInfosByTitle(infoTitle: string) {
  return useQuery<Info[]>({
    queryKey: ['infos', infoTitle],
    queryFn: () => getInfosByTitle(infoTitle),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  })
}