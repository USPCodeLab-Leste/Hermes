import { resetPassword } from "../../api/auth";
import { useState } from "react";

export function useResetPassword({ newPassword, token }: { newPassword: string; token: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendResetPasswordEmail = async () => {
    setLoading(true);
    setError(null);
    try {
      await resetPassword(newPassword, token)
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return [sendResetPasswordEmail, loading, error] as const;
}