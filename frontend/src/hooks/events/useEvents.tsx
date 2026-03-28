import { useInfiniteQuery } from '@tanstack/react-query'
import { getEvents, getFeed } from '../../api/events'
import type { EventsResponse, UseEventsParams } from '../../types/events'
import { useDebounce } from '../useDebounce'
// import { useDebug } from '../useDebug'


export function useEvents({
  eventTitle,
  tags,
  limit = 5,
}: UseEventsParams) {
  const normalizedTitle = eventTitle?.trim()
  const effectiveTitle = normalizedTitle || undefined

  const normalizedTags = tags
    ?.map((tag) => tag.trim())
    .filter(Boolean)

  const hasTags = Boolean(normalizedTags?.length)
  const shouldUseFeed = !effectiveTitle && !hasTags

  const debouncedTitle = useDebounce(effectiveTitle)

  // useDebug("useEvents", {
  //   effectiveTitle,
  //   debouncedTitle
  // })

  const query = useInfiniteQuery<EventsResponse, Error, { pages: EventsResponse[] }, readonly unknown[], number>({
    queryKey: [
      'events',
      debouncedTitle,
      normalizedTags,
      limit,
    ],

    queryFn: ({ pageParam = 0 }) => {
      const params = {
        offset: pageParam,
        limit,
        title: debouncedTitle,
        tags: normalizedTags,
      }

      return shouldUseFeed ? getFeed(params) : getEvents(params)
    },

    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined

      const totalLoaded = allPages.reduce(
        (sum, page) => sum + page.data.length,
        0
      )

      return totalLoaded as number
    },

    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
    initialPageParam: 0,
  })

  const events = query.data?.pages.flatMap((page) => page.data) ?? []

  return {
    events: events,

    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
  }
}