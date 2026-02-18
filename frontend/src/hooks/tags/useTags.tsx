import type { EventTag } from "../../types/tag";
import { getEventTags } from "../../api/tags";
import { useQuery } from "@tanstack/react-query";

export function useTags(enabled: boolean = true) {
  return useQuery<EventTag[]>({
    queryKey: ['all-tags'],
    queryFn: () => getEventTags(),
    enabled
  });
}