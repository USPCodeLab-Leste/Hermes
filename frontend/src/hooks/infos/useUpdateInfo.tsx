import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { HttpError } from "../../types/error";
import type { CreateInfoPayload, Info } from "../../types/infos";
import { patchInfo } from "../../api/infos";

interface UpdateInfoInput extends CreateInfoPayload {
  id: Info["id"];
}

export function useUpdateInfo() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: UpdateInfoInput) => {
      const { id, title, body, tags } = input;

      return patchInfo(id, {
        title: title.trim(),
        body: body.trim(),
        tags,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["infos"] });
      await queryClient.invalidateQueries({ queryKey: ["my-infos"] });
    },
  });

  const update = useCallback((input: UpdateInfoInput) => mutation.mutateAsync(input), [mutation]);

  return [
    update,
    mutation.isPending,
    (mutation.error as HttpError | Error | null) ?? null,
  ] as const;
}
