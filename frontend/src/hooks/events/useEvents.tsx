import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getEvents, getFeed } from '../../api/events'
import type { Event } from '../../types/events'
import { useDebounce } from '../useDebounce'

export function useEvents(eventTitle?: string, tags?: string[]) {
  const normalizedTitle = eventTitle?.trim()
  const effectiveTitle = normalizedTitle ? normalizedTitle : undefined

  const normalizedTags = tags
    ?.map((tag) => tag.trim())
    .filter(Boolean)

  const hasTags = Boolean(normalizedTags && normalizedTags.length > 0)
  const shouldUseFeed = !effectiveTitle && !hasTags

  const debouncedTitle = useDebounce(effectiveTitle, effectiveTitle ? 500 : 0)
  
  const query = useQuery<Event[]>({
    queryKey: ['events', shouldUseFeed ? 'feed' : 'search', debouncedTitle, normalizedTags],
    queryFn: () => (shouldUseFeed ? getFeed() : getEvents(debouncedTitle, normalizedTags)),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  })

  const isTyping = effectiveTitle !== debouncedTitle || query.isFetching
  
  return {
    ...query,
    isTyping
  }
}