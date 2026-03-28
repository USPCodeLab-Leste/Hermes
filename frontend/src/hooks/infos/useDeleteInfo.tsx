import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteInfo } from "../../api/infos";
import { toast } from "react-toastify";

export function useDeleteInfo() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (infoId: string) => deleteInfo(infoId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["infos"] });
      await queryClient.invalidateQueries({ queryKey: ["my-infos"] });
      toast.success("Informação deletada com sucesso!");
    },
  });

  const del = useCallback((infoId: string) => {
    return mutation.mutateAsync(infoId);
  }, [mutation]);

  return [del, mutation.isPending, mutation.error] as const;
}
