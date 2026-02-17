import { useQuery } from '@tanstack/react-query'
import { getInfosByTitle} from '../../api/infos'
import type { Info } from '../../types/infos'

export function useInfosByTitle(infoTitle: string) {
  return useQuery<Info[]>({
    queryKey: ['info', infoTitle],
    queryFn: () => getInfosByTitle(infoTitle),
  })
}