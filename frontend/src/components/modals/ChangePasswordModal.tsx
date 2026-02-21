import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { ModalWrapper } from "./Modal";
import { GenericButton } from "../GenericButton";
import { MemoizedInputPassword as InputPassword } from "../forms/InputPassword";

import { useChangePassword } from "../../hooks/auth/useChangePassword";

const defaultErrors = {
  oldPassword: { hasError: false, message: "" },
  newPassword: { hasError: false, message: "" },
};

export function ChangePasswordModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [changePassword, loading, error] = useChangePassword();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [errors, setErrors] = useState(structuredClone(defaultErrors));
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ oldPassword: "", newPassword: "" });
      setErrors(structuredClone(defaultErrors));
      setIsNewPasswordValid(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!error) return;

    const message = error.message || "Erro interno do servidor";

    if (error.status === 400) {
      toast.error(message);
      return;
    }

    if (error.status === 401) {
      toast.error(message);
      setErrors((prev) => ({
        ...prev,
        oldPassword: {
          hasError: true,
          message: "Senha antiga incorreta.",
        },
      }));
      return;
    }

    if (error.status === 404) {
      toast.error(message);
      return;
    }

    toast.error("Erro interno do servidor");
  }, [error]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({
      ...prev,
      [id]: { hasError: false, message: "" },
    }));
    }, []);

  const validate = useCallback(() => {
    let hasError = false;
    const nextErrors = structuredClone(defaultErrors);

    if (formData.oldPassword.trim() === "") {
      nextErrors.oldPassword = {
        hasError: true,
        message: "A senha antiga é obrigatória.",
      };
      hasError = true;
    }

    if (formData.newPassword.trim() === "") {
      nextErrors.newPassword = {
        hasError: true,
        message: "A senha nova é obrigatória.",
      };
      hasError = true;
    } else if (!isNewPasswordValid) {
      nextErrors.newPassword = {
        hasError: true,
        message: "A senha nova não atende aos requisitos.",
      };
      hasError = true;
    }

    setErrors(nextErrors);
    return !hasError;
  }, [formData.newPassword, formData.oldPassword, isNewPasswordValid]);

  const handleSave = useCallback(async () => {
    if (loading) return;
    if (!validate()) return;

    const result = await changePassword({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });

    if (result) {
      toast.success("Senha atualizada com sucesso!");
      onClose();
    }
  }, [changePassword, formData.newPassword, formData.oldPassword, loading, onClose, validate]);

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <header className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-ink dark:text-paper">
            Alterar senha
          </h2>
          <p className="text-ink/70 dark:text-paper/70 text-sm">
            Informe sua senha antiga e uma nova senha.
          </p>
        </header>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <InputPassword
            id="oldPassword"
            label="Senha antiga"
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder="********"
            autocomplete="current-password"
            disabled={loading}
            required={true}
            validation={false}
            hasError={errors.oldPassword.hasError}
            errorMessage={errors.oldPassword.message}
          />

          <InputPassword
            id="newPassword"
            label="Senha nova"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="********"
            autocomplete="new-password"
            disabled={loading}
            required={true}
            validation={true}
            onValidationChange={setIsNewPasswordValid}
            hasError={errors.newPassword.hasError}
            errorMessage={errors.newPassword.message}
          />

          <GenericButton type="submit" disabled={loading}>
            <span className="text-paper">
              {loading ? "Salvando..." : "Salvar"}
            </span>
          </GenericButton>
        </form>
      </div>
    </ModalWrapper>
  );
}
