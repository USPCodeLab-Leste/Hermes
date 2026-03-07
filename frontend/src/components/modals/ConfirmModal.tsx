import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";

// Components
import { ModalWrapper } from "./Modal";
import { GenericButton } from "../GenericButton";

// Icons
import ExclamationIcon from "../../assets/icons/alert-triangle.svg?react";

export function ConfirmDeleteModal({
  isOpen,
  title = "Confirmar exclusão",
  description = "Tem certeza que deseja excluir? Essa ação não pode ser desfeita.",
  confirmLabel = "Excluir",
  confirmingLabel = "Excluindo...",
  cancelLabel = "Cancelar",
  isLoading = false,
  type = 'delete',
  error,
  onCancel,
  onConfirm,
}: {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  confirmingLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  error?: unknown;
  type?: 'delete' | 'confirm'
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const handleConfirm = useCallback(() => {
    if (isLoading) return;
    
    onConfirm();
  }, [isLoading, onConfirm]);

  useEffect(() => {
    if (!error) return;

    toast.error("Ocorreu um erro ao tentar excluir. Por favor, tente novamente.");
  }, [error]);

  const actionBttnClass = type === 'delete'
    ? "bg-red-500/70 hover:bg-red-500/80"
    : "bg-green-500/70 hover:bg-green-500/80";

  const iconClass = type === 'delete' ? "text-red-500" : "text-green-500";
  const iconWrapperClass = type === 'delete' ? "bg-red-500/20" : "bg-green-500/20";

  return (
    <ModalWrapper isOpen={isOpen} onClose={onCancel}>
      <section className="flex flex-col gap-4">
        <header className="flex flex-col items-center gap-2">
          <div className={`flex items-center justify-center ${iconWrapperClass} rounded-full p-4`}>
            <ExclamationIcon className={`size-14  ${iconClass}`} />
          </div>
          <h2 className="text-2xl font-bold p-2">{title}</h2>
          <p className="opacity-80 p-4 text-center">{description}</p>
        </header>

        <div className="grid grid-cols-2 gap-2">
          <GenericButton onClick={onCancel} disabled={isLoading}>
            <span className="text-paper">{cancelLabel}</span>
          </GenericButton>

          <GenericButton
            onClick={handleConfirm}
            disabled={isLoading}
            className={actionBttnClass}
          >
            <span className="text-paper">{isLoading ? confirmingLabel : confirmLabel}</span>
          </GenericButton>
        </div>
      </section>
    </ModalWrapper>
  );
}
