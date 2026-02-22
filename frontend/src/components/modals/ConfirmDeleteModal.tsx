import { useCallback } from "react";

import { ModalWrapper } from "./Modal";
import { GenericButton } from "../GenericButton";

export function ConfirmDeleteModal({
  isOpen,
  title = "Confirmar exclusão",
  description = "Tem certeza que deseja excluir? Essa ação não pode ser desfeita.",
  confirmLabel = "Excluir",
  cancelLabel = "Cancelar",
  isLoading = false,
  error,
  onCancel,
  onConfirm,
}: {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  error?: unknown;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const handleConfirm = useCallback(() => {
    if (isLoading) return;
    
    onConfirm();
  }, [isLoading, onConfirm]);

  const errorMessage =
    error instanceof Error ? error.message : "Erro ao excluir";

  return (
    <ModalWrapper isOpen={isOpen} onClose={onCancel}>
      <section className="flex flex-col gap-4">
        <header className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="opacity-80">{description}</p>
        </header>

        {Boolean(error) && (
          <p className="text-sm text-red-500/90">
            {errorMessage}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <GenericButton onClick={onCancel} disabled={isLoading}>
            <span className="text-paper">{cancelLabel}</span>
          </GenericButton>

          <GenericButton
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-500/70 hover:bg-red-500/80"
          >
            <span className="text-paper">{isLoading ? "Excluindo..." : confirmLabel}</span>
          </GenericButton>
        </div>
      </section>
    </ModalWrapper>
  );
}
