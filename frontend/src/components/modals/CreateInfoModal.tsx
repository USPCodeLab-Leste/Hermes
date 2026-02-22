import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";

// Components
import { GenericButton } from "../GenericButton";
import { ErrorMessage } from "../forms/ErrorMessage";
import { MemoizedInputText as InputText } from "../forms/InputText";
import { Label } from "../forms/Label";
import { InputWrapper } from "../forms/InputWrapper";
import { ModalWrapper } from "./Modal";
import { MarkdownWritePreview } from "../forms/MarkdownWritePreview";
import {
  getDefaultIconOption,
  IconPickerModal,
} from "./IconPickerModal";
import { LazySvg } from "../LazySvg";

// API
import { postInfo } from "../../api/infos";

// Types
import { infoTypes } from "../../mocks/tags.mock";
import type { InfoTagType } from "../../types/tag";

// Icons
import RightArrowIcon from "../../assets/icons/right-arrow.svg?react";

export function CreateInfoModal({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <CreateInfoModalContent onClose={onClose} onCreated={onCreated} />
    </ModalWrapper>
  );
}

const defaultFormErrors = {
  type: { hasError: false, message: "" },
  title: { hasError: false, message: "" },
  body: { hasError: false, message: "" },
  local: { hasError: false, message: "" },
  tags: { hasError: false, message: "" },
};

const CreateInfoModalContent = ({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated?: () => void;
}) => {
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [confirmed, setConfirmed] = useState({
    clickCount: 0,
    isConfirmed: false,
  });

  const [errors, setErrors] = useState(structuredClone(defaultFormErrors));
  const [isCreatingLoading, setIsCreatingLoading] = useState(false);
  const [iconInfo, setIconInfo] = useState(() => getDefaultIconOption());
  const [formData, setFormData] = useState({
    type: "estudos" as InfoTagType,
    title: "",
    body: "",
    local: "",
    tags: "", // comma-separated
  });

  const tagsArray = useMemo(() => {
    return formData.tags
      .split(",")
      .map((t) => {
        const trimmed = t.trim();
        const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
        return capitalized;
      })
      .filter(Boolean);
  }, [formData.tags]);

  const resetConfirm = useCallback(() => {
    setConfirmed({ clickCount: 0, isConfirmed: false });
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    resetConfirm();
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({
      ...prev,
      [id]: { hasError: false, message: "" },
    }));
  }, [resetConfirm]);

  const validate = useCallback(() => {
    let hasLocalError = false;
    const newErrors = structuredClone(defaultFormErrors);

    if (!formData.type) {
      newErrors.type = { hasError: true, message: "O tipo é obrigatório." };
      hasLocalError = true;
    }

    if (formData.title.trim() === "") {
      newErrors.title = { hasError: true, message: "O título é obrigatório." };
      hasLocalError = true;
    }

    if (formData.body.trim() === "") {
      newErrors.body = { hasError: true, message: "O conteúdo é obrigatório." };
      hasLocalError = true;
    }

    if (formData.local.trim() === "") {
      newErrors.local = { hasError: true, message: "O local é obrigatório." };
      hasLocalError = true;
    }

    if (tagsArray.length === 0) {
      newErrors.tags = {
        hasError: true,
        message: "Informe ao menos UMA tag (separadas por vírgula).",
      };
      hasLocalError = true;
    }

    setErrors(newErrors);
    return !hasLocalError;
  }, [formData.body, formData.local, formData.title, formData.type, tagsArray.length]);

  const handleCreate = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (isCreatingLoading) return;

    if (!validate()) return;

    if (confirmed.clickCount === 0) {
      setConfirmed((prev) => ({
        ...prev,
        clickCount: prev.clickCount + 1,
        isConfirmed: false,
      }));
      return;
    }

    try {
      setIsCreatingLoading(true);

      const payload = {
        type: formData.type,
        title: formData.title.trim(),
        body: formData.body.trim(),
        local: formData.local.trim(),
        tags: tagsArray,
        icon_name: iconInfo?.name ?? "unknown",
      };

      await postInfo(payload);
      toast.success("Informação criada com sucesso!");

      onCreated?.();
      onClose();
      setConfirmed((prev) => ({ ...prev, isConfirmed: true }));
    } catch (error) {
      toast.error("Erro ao criar informação");
    } finally {
      setIsCreatingLoading(false);
    }
  }, [confirmed.clickCount, formData.body, formData.local, formData.title, formData.type, isCreatingLoading, onClose, onCreated, tagsArray, validate]);

  return (
    <div className="flex flex-col gap-4">
      <IconPickerModal
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        selectedIconName={iconInfo?.name}
        onSelect={(option) => {
          resetConfirm();
          setIconInfo(option);
        }}
      />

      <form onSubmit={handleCreate} className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[60dvh]">
          <InputText
            id="title"
            label="Título"
            value={formData.title}
            onChange={handleChange}
            placeholder="Aviso Importante"
            autocomplete="off"
            hasError={errors.title.hasError}
            errorMessage={errors.title.message}
            disabled={isCreatingLoading}
            required={true}
          />

          <MarkdownWritePreview
            id="body"
            label="Conteúdo"
            value={formData.body}
            onChange={(e) => handleChange(e)}
            placeholder="Informamos que o sistema ficará indisponível para manutenção."
            disabled={isCreatingLoading}
            required={true}
            hasError={errors.body.hasError}
            errorMessage={errors.body.message}
          />

          <InputText
            id="local"
            label="Local"
            value={formData.local}
            onChange={handleChange}
            placeholder="Bloco A"
            autocomplete="off"
            hasError={errors.local.hasError}
            errorMessage={errors.local.message}
            disabled={isCreatingLoading}
            required={true}
          />

          {/* Icon */}
          <div className="flex flex-col gap-1">
            <Label id="icon_name" label="Ícone" required />
            <InputWrapper disabled={isCreatingLoading} hasError={false}>
              <button
                id="icon_name"
                type="button"
                onClick={() => setIsIconPickerOpen(true)}
                disabled={isCreatingLoading}
                className="flex items-center gap-2 w-full cursor-pointer"
                aria-label="Selecionar ícone"
              >
                {iconInfo?.name && (
                  <LazySvg
                    name={iconInfo.name}
                    className="size-5 text-paper"
                    aria-hidden="true"
                  />
                )}
                <span className="flex-1 text-left text-paper/90">
                  {iconInfo?.label ?? "Selecionar ícone"}
                </span>
                <RightArrowIcon className="size-4 text-paper rotate-90" aria-hidden="true" />
              </button>
            </InputWrapper>
          </div>

          {/* Info Types */}
          <div className="flex flex-col gap-1">
            <Label id="type" label="Tipo" required={true} />
            <InputWrapper hasError={errors.type.hasError} disabled={isCreatingLoading}>
              <select
                id="type"
                value={formData.type}
                onChange={handleChange}
                disabled={isCreatingLoading}
                className="flex-1 bg-transparent outline-none w-full cursor-pointer"
              >
                {infoTypes.map((type) => (
                  <option key={type} value={type} className="text-ink">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </InputWrapper>
            <ErrorMessage
              hasError={errors.type.hasError}
              errorMessage={errors.type.message}
            />
          </div>

          {/* Tags */}
          <InputText
            id="tags"
            label="Tags (separe por vírgula)"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Aviso, Manutenção"
            autocomplete="off"
            hasError={errors.tags.hasError}
            errorMessage={errors.tags.message}
            disabled={isCreatingLoading}
            required={true}
          />
        </div>
        
        <GenericButton type="submit" disabled={isCreatingLoading}>
          <span className="text-paper">
            {confirmed.clickCount === 0
              ? "Criar Informação"
              : isCreatingLoading
                ? "Criando informação..."
                : "Confirmar Criação"}
          </span>
        </GenericButton>
      </form>
    </div>
  );
};
