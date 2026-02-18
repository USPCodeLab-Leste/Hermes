import { useQuery } from '@tanstack/react-query'
import { getEvents } from '../api/events'
import type { Event } from '../types/events'

export function useEvents() {
  return useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: () => getEvents()
  })
}