import type { Tag, TagType } from "../types/tag";
import { getTagsByType } from "../api/tags";
import { useQuery } from "@tanstack/react-query";

export function useTags() {
  return useQuery<Record<TagType, Tag[]>>({
    queryKey: ['tagsByType'],
    queryFn: () => getTagsByType()
  });
}