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

function createFakeHttpError(status: number, message: string): HttpError {
  const error = new Error(message) as HttpError;
  error.status = status;
  return error;
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: CreateEventInput) => {
      const { bannerFile, title, body, local, data_inicio, data_fim, tags } = input;

      // DEBUG ONLY: simula 401/403 em ambiente de desenvolvimento
      if (import.meta.env.DEV) {
        const trimmedTitle = title.trim().toLowerCase();

        if (trimmedTitle.startsWith("[401]")) {
          throw createFakeHttpError(401, "Simulação de erro 401 (não autenticado)");
        }

        if (trimmedTitle.startsWith("[403]")) {
          throw createFakeHttpError(403, "Simulação de erro 403 (sem permissão)");
        }
      }

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
