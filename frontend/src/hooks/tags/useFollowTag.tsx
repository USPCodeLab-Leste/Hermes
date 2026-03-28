import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";

import { deleteUserTag, postUserTag } from "../../api/users";
import { auth } from "../../services/auth";
import type { HttpError } from "../../types/error";
import type { UserMe } from "../../types/user";

export interface FollowTagInput {
  tagId: string;
  isFollowing: boolean;
}

export function useFollowTag() {
  const mutation = useMutation({
    mutationFn: async (input: FollowTagInput) => {
      if (input.isFollowing) {
        return deleteUserTag(input.tagId);
      }

      return postUserTag({ tagId: input.tagId });
    },
    onMutate: (input) => {
      let previousUser: UserMe | null = null;

      auth.updateUser((user) => {
        previousUser = user;

        if (!user) return user;

        const alreadyFollowing = user.userTags.some((tag) => tag.id === input.tagId);

        if (alreadyFollowing && input.isFollowing) {
          return {
            ...user,
            userTags: user.userTags.filter((tag) => tag.id !== input.tagId),
          };
        }

        if (!alreadyFollowing && !input.isFollowing) {
          return {
            ...user,
            userTags: [
              ...user.userTags,
              { id: input.tagId, name: "" } as any,
            ],
          };
        }

        return user;
      });

      return { previousUser };
    },
    onError: (_error, _variables, context) => {
      if (!context?.previousUser) return;

      auth.updateUser(() => context.previousUser as UserMe | null);
    },
    onSettled: () => {
      auth.refresh();
    },
  });

  const followTag = useCallback(async (input: FollowTagInput) => {
    await mutation.mutateAsync(input);
  }, [mutation]);

  return [
    followTag,
    mutation.isPending,
    (mutation.error as HttpError | Error | null) ?? null,
  ] as const;
}
