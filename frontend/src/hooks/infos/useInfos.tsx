import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getInfosByTitle} from '../../api/infos'
import type { InfosResponse } from '../../types/infos'

export function useInfos(infoTitle: string) {
  const query = useQuery<InfosResponse>({
    queryKey: ['infos', infoTitle],
    queryFn: () => getInfosByTitle(infoTitle),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  })

  return {
    data: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  }
}