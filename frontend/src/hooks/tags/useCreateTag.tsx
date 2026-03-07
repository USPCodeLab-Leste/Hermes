import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { HttpError } from "../../types/error";
import type { TagType } from "../../types/tag";
import { createTag, type CreateTagPayload } from "../../api/tags";

interface CreateTagInput {
  name: string;
  type: TagType;
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: CreateTagInput) => {
      const payload: CreateTagPayload = {
        name: input.name.trim(),
        type: input.type,
      };

      return createTag(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["event-tags"] });
      await queryClient.invalidateQueries({ queryKey: ["info-tags"] });
      await queryClient.invalidateQueries({ queryKey: ["all-tags"] });
    },
  });

  const create = useCallback((input: CreateTagInput) => mutation.mutateAsync(input), [mutation]);

  return [
    create,
    mutation.isPending,
    (mutation.error as HttpError | Error | null) ?? null,
  ] as const;
}
