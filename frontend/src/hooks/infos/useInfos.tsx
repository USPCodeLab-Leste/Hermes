import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getInfos } from '../../api/infos'
import type { InfosResponse } from '../../types/infos'

export function useInfos(infoTitle: string) {
  const query = useQuery<InfosResponse>({
    queryKey: ['infos', infoTitle],
    queryFn: () => getInfos(infoTitle),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  })

  return {
    data: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  }
}