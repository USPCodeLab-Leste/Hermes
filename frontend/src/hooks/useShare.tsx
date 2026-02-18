import { useCallback } from "react";
import { toast } from "react-toastify";

type ShareOptions = {
  title?: string;
  text?: string;
  url: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function useShare() {
  const share = useCallback(async (options: ShareOptions) => {
    const { title, text, url, onSuccess, onError } = options;

    if (!url) return;

    const shareData: ShareData = {
      title,
      text,
      url,
    };

    const isTouchDevice = navigator.maxTouchPoints > 0;

    if (navigator.share && isTouchDevice) {
      try {
        await navigator.share(shareData);
        onSuccess?.();
        return;
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        onError?.(error);
      }
    }

    // Fallback desktop
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado com sucesso!");
      onSuccess?.();
    } catch (error) {
      toast.error("Não foi possível copiar o link.");
      onError?.(error);
    }
  }, []);

  return share;
}
