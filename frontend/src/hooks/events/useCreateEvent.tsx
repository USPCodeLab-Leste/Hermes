import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { HttpError } from "../../types/error";
import { postEvent } from "../../api/events";
import { uploadBannerAndGetUrl } from "../../utils/files";

interface CreateEventInput {
  title: string;
  body: string;
  local: string;
  data_inicio: string;
  data_fim: string;
  tags: string[];
  bannerFile: File;
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: CreateEventInput) => {
      const { bannerFile, title, body, local, data_inicio, data_fim, tags } = input;

      const img_banner = await uploadBannerAndGetUrl(bannerFile);

      const payload = {
        title: title.trim(),
        body: body.trim(),
        local: local.trim(),
        data_inicio: data_inicio + ":00Z",
        data_fim: data_fim + ":00Z",
        img_banner,
        tags,
      };

      return postEvent(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["events"] });
      await queryClient.invalidateQueries({ queryKey: ["my-events"] });
    },
  });

  const create = useCallback((input: CreateEventInput) => mutation.mutateAsync(input), [mutation]);

  return [
    create,
    mutation.isPending,
    (mutation.error as HttpError | Error | null) ?? null,
  ] as const;
}
