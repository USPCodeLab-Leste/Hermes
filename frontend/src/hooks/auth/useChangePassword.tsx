import { useState } from "react";

import { postChangePassword } from "../../api/users";

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export type ChangePasswordError = {
  id: number;
  status: 400 | 401 | 404 | 500;
  message: string;
};

export function useChangePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ChangePasswordError | null>(null);

  const changePassword = async (data: ChangePasswordPayload) => {
    setLoading(true);
    setError(null);

    try {
      const result = await postChangePassword(data);
      setLoading(false);
      return result;
    } catch (err: any) {
      const status =
        err?.status === 400 ||
        err?.status === 401 ||
        err?.status === 404 ||
        err?.status === 500
          ? err.status
          : 500;

      const message =
        typeof err?.message === "string" && err.message
          ? err.message
          : "Erro interno do servidor";

      setError({ id: Date.now(), status, message });
      setLoading(false);
      return null;
    }
  };

  return [changePassword, loading, error] as const;
}
