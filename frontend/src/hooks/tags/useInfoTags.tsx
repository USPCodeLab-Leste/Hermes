import type { InfoTag } from "../../types/tag";
import { getInfoTags } from "../../api/tags";
import { useQuery } from "@tanstack/react-query";

export function useInfoTags(enabled: boolean = true) {
  return useQuery<InfoTag[]>({
    queryKey: ["info-tags"],
    queryFn: () => getInfoTags(),
    enabled,
  });
}
