import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getMyEvents } from '../../api/events'
import type { Event } from '../../types/events'
import { useDebounce } from '../useDebounce';

export function useMyEvents(eventTitle?: string) {
  const debouncedTitle = useDebounce(eventTitle, eventTitle ? 500 : 0);
  
  const query = useQuery<Event[]>({
    queryKey: ['my-events', debouncedTitle],
    queryFn: () => getMyEvents(debouncedTitle),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  })

  const isTyping = eventTitle !== debouncedTitle || query.isFetching;
  
  return {
    ...query,
    isTyping
  }
}