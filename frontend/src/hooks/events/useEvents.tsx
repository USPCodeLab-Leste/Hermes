import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getEvents } from '../../api/events'
import type { Event } from '../../types/events'
import { useDebounce } from '../useDebounce'

export function useEvents(eventTitle?: string, tags?: string[]) {
  const debouncedTitle = useDebounce(eventTitle, eventTitle ? 500 : 0);
  
  const query = useQuery<Event[]>({
    queryKey: ['events', debouncedTitle, tags],
    queryFn: () => getEvents(debouncedTitle, tags),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  })

  const isTyping = eventTitle !== debouncedTitle || query.isFetching;
  
  return {
    ...query,
    isTyping
  }
}