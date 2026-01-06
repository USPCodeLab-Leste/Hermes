import { useQuery } from '@tanstack/react-query'
import { getForYouFeed, getFollowingFeed } from '../api/feed'
import type { Product } from '../types/product'

export type FeedType = 'for-you' | 'following'

function fetchFeed(type: FeedType): Promise<Product[]> {
  if (type === 'following') {
    return getFollowingFeed()
  }

  return getForYouFeed()
}

export function useFeed(type: FeedType) {
  return useQuery<Product[]>({
    queryKey: ['feed', type],
    queryFn: () => fetchFeed(type),
  })
}