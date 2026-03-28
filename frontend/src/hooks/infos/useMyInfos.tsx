import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getMyInfos } from '../../api/infos'
import type { InfosResponse } from '../../types/infos'
import { useDebounce } from '../useDebounce';

export function useMyInfos(infoTitle?: string) {
  const debouncedTitle = useDebounce(infoTitle);

  const query = useQuery<InfosResponse>({
    queryKey: ['my-infos', debouncedTitle],
    queryFn: () => getMyInfos(debouncedTitle),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  })


  return {
    data: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  }
}
