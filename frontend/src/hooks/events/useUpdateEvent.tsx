import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { HttpError } from "../../types/error";
import { patchEvent } from "../../api/events";
import { uploadBannerAndGetUrl } from "../../utils/files";

interface UpdateEventInput {
  id: string;
  title: string;
  body: string;
  local: string;
  data_inicio: string;
  data_fim: string;
  tags: string[];
  bannerFile?: File | null;
  existingBannerUrl?: string | null;
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: UpdateEventInput) => {
      const { id, bannerFile, existingBannerUrl, title, body, local, data_inicio, data_fim, tags } = input;

      let img_banner: string | undefined = existingBannerUrl ?? undefined;

      if (bannerFile) {
        img_banner = await uploadBannerAndGetUrl(bannerFile);
      }

      const payload: any = {
        title: title.trim(),
        body: body.trim(),
        local: local.trim(),
        data_inicio: data_inicio + ":00Z",
        data_fim: data_fim + ":00Z",
        tags,
      };

      if (img_banner) {
        payload.img_banner = img_banner;
      }

      return patchEvent(id, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["events"] });
      await queryClient.invalidateQueries({ queryKey: ["my-events"] });
    },
  });

  const update = useCallback((input: UpdateEventInput) => mutation.mutateAsync(input), [mutation]);

  return [
    update,
    mutation.isPending,
    (mutation.error as HttpError | Error | null) ?? null,
  ] as const;
}
