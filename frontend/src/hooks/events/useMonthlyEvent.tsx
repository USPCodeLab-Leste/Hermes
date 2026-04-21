import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { SimpleEventsResponse } from '../../types/events';
import { getEventsByDate } from '../../api/events';

interface MonthlyEventParam {
  month: number
  year: number
}

export function useMonthlyEvent({ month, year }: MonthlyEventParam) {
  const query = useQuery<SimpleEventsResponse>({
    queryKey: ['monthly-events', month, year],
    queryFn: () => getEventsByDate(month + 1, year),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching
  }
}