import { useQuery } from '@tanstack/react-query'
import { getEvents } from '../api/events'
import type { Event } from '../types/events'

export function useEvents(eventTitle?: string, tags?: string[]) {
  return useQuery<Event[]>({
    queryKey: ['events', eventTitle, tags],
    queryFn: () => getEvents(eventTitle, tags)
  })
}