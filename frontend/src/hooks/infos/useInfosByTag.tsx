import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getInfosByTag } from '../../api/infos'
import type { InfosResponse } from '../../types/infos'
import { useDebounce } from '../useDebounce';

export function useInfosByTag(tagName: string, infoTitle?: string) {
  const debouncedTitle = useDebounce(infoTitle);

  const query = useQuery<InfosResponse>({
    queryKey: ['infos', tagName, debouncedTitle],
    queryFn: () => getInfosByTag(tagName, debouncedTitle),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  })

  return {
    data: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  }
}