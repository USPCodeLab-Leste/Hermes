import { useQuery } from '@tanstack/react-query'
import { getInfosByTag } from '../../api/infos'
import type { Info } from '../../types/infos'

export function useInfosByTag(tagName: string, infoTitle?: string) {
  return useQuery<Info[]>({
    queryKey: ['info', tagName, infoTitle],
    queryFn: () => getInfosByTag(tagName, infoTitle),
  })
}