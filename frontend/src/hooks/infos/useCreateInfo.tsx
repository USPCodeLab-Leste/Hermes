import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { HttpError } from "../../types/error";
import type { CreateInfoPayload } from "../../types/infos";
import { postInfo } from "../../api/infos";

export function useCreateInfo() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: CreateInfoPayload) => {
      const payload: CreateInfoPayload = {
        title: input.title.trim(),
        body: input.body.trim(),
        tags: input.tags,
      };

      return postInfo(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["infos"] });
      await queryClient.invalidateQueries({ queryKey: ["my-infos"] });
    },
  });

  const create = useCallback(
    (input: CreateInfoPayload) => mutation.mutateAsync(input),
    [mutation],
  );

  return [
    create,
    mutation.isPending,
    (mutation.error as HttpError | Error | null) ?? null,
  ] as const;
}
