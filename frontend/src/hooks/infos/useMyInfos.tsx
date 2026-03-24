import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getMyInfos } from '../../api/infos'
import type { InfosResponse } from '../../types/infos'
import { useDebounce } from '../useDebounce';
import { useMe } from '../useMe';

export function useMyInfos(infoTitle?: string) {
  const debouncedTitle = useDebounce(infoTitle);

  const { data: me, isLoading: isMeLoading } = useMe()

  const query = useQuery<InfosResponse>({
    queryKey: ['my-infos', debouncedTitle],
    queryFn: () => getMyInfos(debouncedTitle),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  })


  const infos = query.data?.data ?? []

  const userId = me?.id
  const filteredInfos = userId
    ? infos.filter((info) => info.autor_id === userId)
    : infos

  return {
    data: filteredInfos,
    isLoading: query.isLoading || isMeLoading,
    isFetching: query.isFetching,
  }
}
