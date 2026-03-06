import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

// Componentes
import { ModalWrapper } from "./Modal";
import { MemoizedInputText as InputText } from "../forms/InputText";
import { GenericButton } from "../GenericButton";

// Hooks
import { useChangeName } from "../../hooks/auth/useChangeName";

export function ChangeNameModal({
  isOpen,
  onClose,
  currentName,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentName?: string;
}) {
  const [changeName, isLoading, apiError] = useChangeName();

  const [name, setName] = useState(() => currentName ?? "");
  const [error, setError] = useState({ hasError: false, message: "" });

  useEffect(() => {
    if (!apiError) return;

    const message = apiError.message || "Erro interno do servidor";

    if (apiError.status === 400) {
      toast.error(message);
      setError({
        hasError: true,
        message: message,
      });
      return;
    }

    if (apiError.status === 401) {
      toast.error(message);
    }
  }, [apiError]);

  const validate = useCallback(() => {
    if (name.trim() === "") {
      setError({ hasError: true, message: "O nome é obrigatório." });
      return false;
    } else if (name.trim().length < 3) {
      setError({ hasError: true, message: "O nome deve conter ao menos 3 caracteres." });
      return false;
    }

    setError({ hasError: false, message: "" });
    return true;
  }, [name]);

  const handleSave = useCallback(async () => {
    if (isLoading) return;
    if (!validate()) return;

    const result = await changeName({ name: name.trim() });

    if (result) {
      toast.success("Nome atualizado com sucesso!");
      onClose();
    }
  }, [changeName, isLoading, name, onClose, validate]);

  return (
    <ModalWrapper isOpen={isOpen} onClose={() => isLoading ? undefined : onClose()}>
      <div className="flex flex-col gap-4">
        <header className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-ink dark:text-paper">
            Alterar nome
          </h2>
          <p className="text-ink/70 dark:text-paper/70 text-sm">
            Troque apenas seu nome de exibição.
          </p>
        </header>

        <form
          className="flex flex-col gap-4"
          action={handleSave}
        >
          <InputText
            id="name"
            label="Nome"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value);
              if (error.hasError) setError({ hasError: false, message: "" });
            }}
            placeholder="Seu nome"
            autocomplete="name"
            hasError={error.hasError}
            errorMessage={error.message}
            disabled={isLoading}
            required={true}
          />

          <GenericButton type="submit" disabled={isLoading || name === currentName}>
            <span className="text-paper">
              {isLoading ? "Salvando..." : apiError ? "Tentar novamente" : "Salvar"}
            </span>
          </GenericButton>
        </form>
      </div>
    </ModalWrapper>
  );
}
