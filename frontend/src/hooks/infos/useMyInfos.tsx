import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getMyInfos } from '../../api/infos'
import type { Info } from '../../types/infos'
import { useDebounce } from '../useDebounce';

export function useMyInfos(infoTitle?: string) {
  const debouncedTitle = useDebounce(infoTitle, infoTitle ? 500 : 0);

  const query = useQuery<Info[]>({
    queryKey: ['my-infos', debouncedTitle],
    queryFn: () => getMyInfos(debouncedTitle),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  })

  const isTyping = infoTitle !== debouncedTitle || query.isFetching;

  return {
    ...query,
    isTyping
  }
}
