import { forgotPassword } from "../../api/auth";
import { useState } from "react";

export function useForgotPassword(email: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendForgotPasswordEmail = async () => {
    setLoading(true);
    setError(null);
    try {
      await forgotPassword(email);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return [sendForgotPasswordEmail, loading, error] as const;
}