import { useQuery } from '@tanstack/react-query'
import { getMyEvents } from '../api/events'
import type { Event } from '../types/events'

export function useMyEvents() {
  return useQuery<Event[]>({
    queryKey: ['my-events'],
    queryFn: () => getMyEvents()
  })
}