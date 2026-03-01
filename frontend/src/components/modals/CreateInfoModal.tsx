import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

// Components
import { GenericButton } from "../GenericButton";
import { MemoizedInputText as InputText } from "../forms/InputText";
import { Label } from "../forms/Label";
import { InputWrapper } from "../forms/InputWrapper";
import { ModalWrapper } from "./Modal";
import { MarkdownWritePreview } from "../forms/MarkdownWritePreview";
import {
  getDefaultIconOption,
  getIconOptionByName,
  IconPickerModal,
} from "./IconPickerModal";
import { LazySvg } from "../LazySvg";
import { SelectTags } from "../Events";

// API
import { useInfoTags } from "../../hooks/tags/useInfoTags";
import { useCreateInfo } from "../../hooks/infos/useCreateInfo";
import { useUpdateInfo } from "../../hooks/infos/useUpdateInfo";
import type { ActiveTags, GenericTag } from "../../types/tag";
import type { Info } from "../../types/infos";

// Icons
import RightArrowIcon from "../../assets/icons/right-arrow.svg?react";
import { ErrorMessage } from "../forms/ErrorMessage";

export function CreateInfoModal({
  isOpen,
  onClose,
  onCreated,
  initialInfo,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
  initialInfo?: Info | null;
}) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <CreateInfoModalContent
        onClose={onClose}
        onCreated={onCreated}
        initialInfo={initialInfo ?? null}
      />
    </ModalWrapper>
  );
}

const defaultFormErrors = {
  title: { hasError: false, message: "" },
  body: { hasError: false, message: "" },
  tags: { hasError: false, message: "" },
};

const CreateInfoModalContent = ({
  onClose,
  onCreated,
  initialInfo,
}: {
  onClose: () => void;
  onCreated?: () => void;
  initialInfo: Info | null;
}) => {
  const [createInfo, isCreateLoading] = useCreateInfo();
  const [updateInfo, isUpdateLoading] = useUpdateInfo();
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [confirmed, setConfirmed] = useState({
    clickCount: 0,
    isConfirmed: false,
  });

  const [errors, setErrors] = useState(structuredClone(defaultFormErrors));
  const [iconInfo, setIconInfo] = useState(() => getDefaultIconOption());
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });

  const { data: availableTags = [], isLoading: isLoadingTags } = useInfoTags(true);
  const [activeTags, setActiveTags] = useState<ActiveTags>({} as ActiveTags);

  const isEditMode = Boolean(initialInfo);

  useEffect(() => {
    if (!initialInfo) return;

    setFormData({
      title: initialInfo.title ?? "",
      body: initialInfo.body ?? "",
    });

    const initialActiveTags: ActiveTags = {};
    (initialInfo.tags ?? []).forEach((tag) => {
      initialActiveTags[tag.id] = tag as GenericTag;
    });
    setActiveTags(initialActiveTags);

    if (initialInfo.icon_name) {
      const existingIcon = getIconOptionByName(initialInfo.icon_name);
      setIconInfo(existingIcon ?? getDefaultIconOption());
    }
  }, [initialInfo]);

  const tagsArray = useMemo(() => Object.values(activeTags).map((tag) => tag.name), [activeTags]);

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

  const handleToggleTag = useCallback((tag: GenericTag) => {
    setActiveTags((prev) => {
      if (prev[tag.id]) {
        const { [tag.id]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [tag.id]: tag,
      };
    });

    // Ao alterar tags, limpamos o erro de tags pendente
    setErrors((prev) => ({
      ...prev,
      tags: { hasError: false, message: "" },
    }));
  }, []);

  const validate = useCallback(() => {
    let hasLocalError = false;
    const newErrors = structuredClone(defaultFormErrors);

    if (formData.title.trim() === "") {
      newErrors.title = { hasError: true, message: "O título é obrigatório." };
      hasLocalError = true;
    } else if (formData.title.trim().length < 3) {
      newErrors.title = { hasError: true, message: "O título deve ter ao menos 3 caracteres." };
      hasLocalError = true;
    } else if (formData.title.trim().length > 100) {
      newErrors.title = { hasError: true, message: "O título deve ter no máximo 100 caracteres." };
      hasLocalError = true;
    }

    if (formData.body.trim() === "") {
      newErrors.body = { hasError: true, message: "O conteúdo é obrigatório." };
      hasLocalError = true;
    } else if (formData.body.trim().length < 10) {
      newErrors.body = { hasError: true, message: "O conteúdo deve ter ao menos 10 caracteres." };
      hasLocalError = true;
    } else if (formData.body.trim().length > 1000) {
      newErrors.body = { hasError: true, message: "O conteúdo deve ter no máximo 1000 caracteres." };
      hasLocalError = true;
    }

    if (tagsArray.length === 0) {
      newErrors.tags = {
        hasError: true,
        message: "Informe ao menos UMA tag (separadas por vírgula).",
      };
      hasLocalError = true;
    } else if (tagsArray.length > 5) {
      newErrors.tags = {
        hasError: true,
        message: "Informe no máximo CINCO tags (separadas por vírgula).",
      };
      hasLocalError = true;
    }

    setErrors(newErrors);
    return !hasLocalError;
  }, [formData.body, formData.title, tagsArray.length]);

  const handleCreate = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();

    const isSaving = isEditMode ? isUpdateLoading : isCreateLoading;

    if (isSaving) return;

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
      if (isEditMode && initialInfo) {
        await updateInfo({
          id: initialInfo.id,
          title: formData.title.trim(),
          body: formData.body.trim(),
          tags: tagsArray,
        });

        toast.success("Informação atualizada com sucesso!");
      } else {
        await createInfo({
          title: formData.title.trim(),
          body: formData.body.trim(),
          tags: tagsArray,
        });

        toast.success("Informação criada com sucesso!");
      }

      onCreated?.();
      onClose();
      setConfirmed((prev) => ({ ...prev, isConfirmed: true }));
    } catch (error) {
      toast.error("Erro ao salvar informação");
    }
  }, [
    confirmed.clickCount,
    createInfo,
    updateInfo,
    formData.body,
    formData.title,
    initialInfo,
    isCreateLoading,
    isUpdateLoading,
    isEditMode,
    onClose,
    onCreated,
    tagsArray,
    validate,
  ]);

  const hasAnyError = useMemo(() => errors.title.hasError || errors.body.hasError || errors.tags.hasError, [errors]);

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
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[60dvh] pb-2">
          <InputText
            id="title"
            label="Título"
            value={formData.title}
            onChange={handleChange}
            placeholder="Aviso Importante"
            autocomplete="off"
            hasError={errors.title.hasError}
            errorMessage={errors.title.message}
            disabled={isEditMode ? isUpdateLoading : isCreateLoading}
            required={true}
          />

          <MarkdownWritePreview
            id="body"
            label="Conteúdo"
            value={formData.body}
            onChange={(e) => handleChange(e)}
            placeholder="Informamos que o sistema ficará indisponível para manutenção."
            disabled={isEditMode ? isUpdateLoading : isCreateLoading}
            required={true}
            hasError={errors.body.hasError}
            errorMessage={errors.body.message}
          />

          {/* Icon */}
          <div className="flex flex-col gap-1">
            <Label id="icon_name" label="Ícone" required />
            <InputWrapper disabled={isEditMode ? isUpdateLoading : isCreateLoading} hasError={false}>
              <button
                id="icon_name"
                type="button"
                onClick={() => setIsIconPickerOpen(true)}
                disabled={isEditMode ? isUpdateLoading : isCreateLoading}
                className="flex items-center gap-2 w-full cursor-pointer"
                aria-label="Selecionar ícone"
              >
                {iconInfo?.name && (
                  <LazySvg
                    name={iconInfo.name}
                    className="size-5"
                    aria-hidden="true"
                  />
                )}
                <span className="flex-1 text-left">
                  {iconInfo?.label ?? "Selecionar ícone"}
                </span>
                <RightArrowIcon className="size-4 rotate-90" aria-hidden="true" />
              </button>
            </InputWrapper>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1">
            <Label id="tags" label="Tags" required={true} />
            {isLoadingTags ? (
              <p className="text-sm text-gray-500">Carregando tags...</p>
            ) : (
              <SelectTags
                tags={availableTags as GenericTag[]}
                activeTags={activeTags}
                onClick={handleToggleTag}
              />
            )}
            <ErrorMessage
              hasError={errors.tags.hasError}
              errorMessage={errors.tags.message}
            />
          </div>
        </div>
        
        <GenericButton
          type="submit"
          disabled={(isEditMode ? isUpdateLoading : isCreateLoading) || hasAnyError}
        >
          <span className="text-paper">
            {confirmed.clickCount === 0
              ? (isEditMode ? "Salvar alterações" : "Criar Informação")
              : (isEditMode
                  ? (isUpdateLoading ? "Salvando..." : "Confirmar alterações")
                  : (isCreateLoading ? "Criando informação..." : "Confirmar Criação"))}
          </span>
        </GenericButton>
      </form>
    </div>
  );
};
