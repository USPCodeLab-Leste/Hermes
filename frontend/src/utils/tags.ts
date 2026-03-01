import type { GenericTag } from "../types/tag";

export function groupByType(tags: GenericTag[] | undefined) {
  return tags?.reduce((acc, tag) => {
      if (!acc[tag.type]) {
        acc[tag.type] = [];
      }
      acc[tag.type].push(tag);
      return acc;
    }, {} as Record<string, GenericTag[]>);
}