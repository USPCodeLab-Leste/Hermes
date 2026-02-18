import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getInfosByTag } from '../../api/infos'
import type { Info } from '../../types/infos'
import { useDebounce } from '../useDebounce';

export function useInfosByTag(tagName: string, infoTitle?: string) {
  const debouncedTitle = useDebounce(infoTitle);

  const query = useQuery<Info[]>({
    queryKey: ['info', tagName, debouncedTitle],
    queryFn: () => getInfosByTag(tagName, debouncedTitle),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  })
  
  const isTyping = infoTitle !== debouncedTitle || query.isFetching;

  return {
    ...query,
    isTyping
  }
}