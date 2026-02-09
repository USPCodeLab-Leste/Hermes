import { useQuery } from '@tanstack/react-query'
import { getInfosByTag } from '../../api/infos'
import type { Info } from '../../types/infos'

export function useInfosByTag(tagId: string) {
  return useQuery<Info[]>({
    queryKey: ['info', tagId],
    queryFn: () => getInfosByTag(tagId)
  })
}