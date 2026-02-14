import { useQuery } from '@tanstack/react-query'
import { getMyEvents } from '../../api/events'
import type { Event } from '../../types/events'

export function useMyEvents(eventTitle?: string) {
  return useQuery<Event[]>({
    queryKey: ['my-events', eventTitle],
    queryFn: () => getMyEvents(eventTitle)
  })
}