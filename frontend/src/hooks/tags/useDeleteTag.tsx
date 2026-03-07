import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteTag } from "../../api/tags";

export function useDeleteTag() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (tagId: string) => deleteTag(tagId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["event-tags"] });
      await queryClient.invalidateQueries({ queryKey: ["info-tags"] });
      toast.success("Tag deletada com sucesso!");
    },
  });

  const del = useCallback((tagId: string) => mutation.mutateAsync(tagId), [mutation]);

  return [del, mutation.isPending, mutation.error] as const;
}
