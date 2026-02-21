import { useState } from "react";

import { postChangeName } from "../../api/users";

export interface ChangeNamePayload {
  name: string;
}

export type ChangeNameError = {
  id: number;
  status: 400 | 401 | 500;
  message: string;
};

export function useChangeName() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ChangeNameError | null>(null);

  const changeName = async (data: ChangeNamePayload) => {
    setLoading(true);
    setError(null);

    try {
      const result = await postChangeName(data);
      setLoading(false);
      return result;
    } catch (err: any) {
      const status = err?.status === 400 || err?.status === 401 ? err.status : 500;

      const message =
        typeof err?.message === "string" && err.message
          ? err.message
          : "Erro interno do servidor";

      setError({ id: Date.now(), status, message });
      setLoading(false);
      return null;
    }
  };

  return [changeName, loading, error] as const;
}
