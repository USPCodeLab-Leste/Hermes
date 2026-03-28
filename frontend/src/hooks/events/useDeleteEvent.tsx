import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { deleteEvent } from "../../api/events";

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (eventId: string) => deleteEvent(eventId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["events"] });
      await queryClient.invalidateQueries({ queryKey: ["my-events"] });
      toast.success("Evento deletado com sucesso!");
    },
  });

  const del = useCallback((eventId: string) => {
    return mutation.mutateAsync(eventId);
  }, [mutation]);

  return [del, mutation.isPending, mutation.error] as const;
}
