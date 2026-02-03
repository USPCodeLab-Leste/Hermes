import type { EventTag, EventTagType } from "../types/tag";
import { getEventTagsByType } from "../api/tags";
import { useQuery } from "@tanstack/react-query";

export function useTags() {
  return useQuery<Record<EventTagType, EventTag[]>>({
    queryKey: ['tagsByType'],
    queryFn: () => getEventTagsByType()
  });
}