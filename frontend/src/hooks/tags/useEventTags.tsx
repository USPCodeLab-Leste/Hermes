import type { EventTag } from "../../types/tag";
import { getEventTags } from "../../api/tags";
import { useQuery } from "@tanstack/react-query";

export function useEventTags(enabled: boolean = true) {
  return useQuery<EventTag[]>({
    queryKey: ['event-tags'],
    queryFn: () => getEventTags(),
    enabled
  });
}