import { useInfiniteQuery } from '@tanstack/react-query'
import { getMyEvents } from '../../api/events'
import type { EventsResponse } from '../../types/events'
import { useDebounce } from '../useDebounce';
import { useMe } from '../useMe';

export function useMyEvents(eventTitle?: string) {
  const limit = 9
  const normalizedTitle = eventTitle?.trim()
  const effectiveTitle = normalizedTitle || undefined
  const debouncedTitle = useDebounce(effectiveTitle, effectiveTitle ? 500 : 0)

  const { data: me, isLoading: isMeLoading } = useMe()

  const query = useInfiniteQuery<EventsResponse, Error, { pages: EventsResponse[] }, readonly unknown[], number>({
    queryKey: ['my-events', debouncedTitle, limit],

    queryFn: ({ pageParam = 0 }) => {
      return getMyEvents({
        offset: pageParam,
        limit,
        title: debouncedTitle,
      })
    },

    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined

      const totalLoaded = allPages.reduce((sum, page) => sum + page.data.length, 0)
      return totalLoaded as number
    },

    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
    initialPageParam: 0,
  })

  const events = query.data?.pages.flatMap((page) => page.data) ?? []

  const userId = me?.id
  const filteredEvents = userId
    ? events.filter((event) => event.autor_id === userId)
    : events

  return {
    events: filteredEvents,

    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,

  isLoading: query.isLoading || isMeLoading,
  isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
  }
}