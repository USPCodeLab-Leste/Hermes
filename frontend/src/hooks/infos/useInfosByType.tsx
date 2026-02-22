import { useQuery } from '@tanstack/react-query'
import { getInfoByType } from '../../api/infos'
import type { InfosResponse } from '../../types/infos'

export function useInfosByType(type: string, title?: string) {
  const query = useQuery<InfosResponse>({
    queryKey: ['infos', title, type],
    queryFn: () => getInfoByType(type, title)
  })

  return {
    data: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  }
}