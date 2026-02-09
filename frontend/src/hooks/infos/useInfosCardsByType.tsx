import { useQuery } from '@tanstack/react-query'
import { getInfosCardsByType } from '../../api/infos'
import type { InfoCard } from '../../types/infos'

export function useInfosCardsByType(type: string) {
  return useQuery<InfoCard[]>({
    queryKey: ['infos-cards', type],
    queryFn: () => getInfosCardsByType(type)
  })
}