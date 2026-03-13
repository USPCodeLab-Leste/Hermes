import { useCallback, useMemo, useState } from "react";
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
import { ConfirmDeleteModal } from "./ConfirmModal";
import { TagSkeleton } from "../skeletons/TagsSkeleton";

// Hooks
import { useInfoTags } from "../../hooks/tags/useInfoTags";
import { useCreateInfo } from "../../hooks/infos/useCreateInfo";
import { useUpdateInfo } from "../../hooks/infos/useUpdateInfo";

// Types
import type { ActiveTags, GenericTag } from "../../types/tag";
import type { Info } from "../../types/infos";

// Icons
import RightArrowIcon from "../../assets/icons/right-arrow.svg?react";
import { ErrorMessage } from "../forms/ErrorMessage";
import { Tooltip } from "../Tooltip";

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

const getInitialFormData = (info: Info | null) => ({
  title: info?.title ?? "",
  body: info?.body ?? "",
});

const getInitialActiveTags = (info: Info | null): ActiveTags => {
  if (!info?.tags) return {} as ActiveTags;

  const initialActiveTags: ActiveTags = {} as ActiveTags;
  info.tags.forEach((tag) => {
    initialActiveTags[tag.id] = tag as GenericTag;
  });

  return initialActiveTags;
};

const getInitialIconInfo = (info: Info | null) => {
  if (!info?.icon_name) return getDefaultIconOption();

  const existingIcon = getIconOptionByName(info.icon_name);
  return existingIcon ?? getDefaultIconOption();
};

const INFO_MAX_CONTENT_LENGTH = 1000;

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [errors, setErrors] = useState(() => structuredClone(defaultFormErrors));
  const [iconInfo, setIconInfo] = useState(() => getInitialIconInfo(initialInfo));
  const [formData, setFormData] = useState(() => getInitialFormData(initialInfo));

  const { data: availableTags = [], isLoading: isLoadingTags } = useInfoTags(true);
  const [activeTags, setActiveTags] = useState<ActiveTags>(() => getInitialActiveTags(initialInfo));

  const isEditMode = Boolean(initialInfo);

  const tagsArray = useMemo(() => Object.values(activeTags).map((tag) => tag.name), [activeTags]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({
      ...prev,
      [id]: { hasError: false, message: "" },
    }));
  }, []);

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
    } else if (formData.body.trim().length > INFO_MAX_CONTENT_LENGTH) {
      newErrors.body = { hasError: true, message: `O conteúdo deve ter no máximo ${INFO_MAX_CONTENT_LENGTH} caracteres.` };
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

  const handleOpenConfirm = useCallback(() => {
    const isSaving = isEditMode ? isUpdateLoading : isCreateLoading;

    if (isSaving) return;

    if (!validate()) return;

    setIsConfirmOpen(true);
  }, [isCreateLoading, isUpdateLoading, isEditMode, validate]);

  const handleConfirmCreateOrUpdate = useCallback(async () => {
    try {
      if (isEditMode && initialInfo) {
        await updateInfo({
          id: initialInfo.id,
          title: formData.title.trim(),
          body: formData.body.trim(),
          icon_name: iconInfo.name,
          tags: tagsArray,
        });

        toast.success("Informação atualizada com sucesso!");
      } else {
        await createInfo({
          title: formData.title.trim(),
          body: formData.body.trim(),
          icon_name: iconInfo.name,
          tags: tagsArray,
        });

        toast.success("Informação criada com sucesso!");
      }

      onCreated?.();
      onClose();
      setIsConfirmOpen(false);
    } catch (error) {
      toast.error("Erro ao salvar informação");
    }
  }, [
    createInfo,
    updateInfo,
    formData.body,
    formData.title,
    iconInfo,
    initialInfo,
    isEditMode,
    onClose,
    onCreated,
    tagsArray,
  ]);

  const hasAnyError = useMemo(() => errors.title.hasError || errors.body.hasError || errors.tags.hasError, [errors]);

  return (
    <div className="flex flex-col gap-4">
      <IconPickerModal
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        selectedIconName={iconInfo?.name}
        onSelect={(option) => {
          setIconInfo(option);
        }}
      />

      <form action={handleOpenConfirm} className="flex flex-col gap-3">
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
            maxLength={INFO_MAX_CONTENT_LENGTH}
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
            <div className="flex flex-row items-center gap-2">
              <Label id="tags" label="Tags" required={true} />
              <Tooltip content="Caso não encontre a tag que deseja, vá na aba Tags e crie a sua"/>
            </div>
            {isLoadingTags ? (
              <TagSkeleton hasType={false} />
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
            {(hasAnyError)  ? "Corrija os Erros"
              : isEditMode
                ? (isUpdateLoading ? "Salvando..." : "Salvar alterações")
                : (isCreateLoading ? "Criando informação..." : "Criar Informação")}
          </span>
        </GenericButton>
      </form>

      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        title={isEditMode ? "Editar informação" : "Criar informação"}
        description={isEditMode
          ? "Tem certeza que deseja salvar as alterações desta informação?"
          : "Tem certeza que deseja criar esta informação?"}
        confirmLabel={isEditMode ? "Confirmar alterações" : "Confirmar criação"}
        confirmingLabel={isEditMode ? "Confirmando alterações..." : "Confirmando criação..."}
        cancelLabel="Cancelar"
        isLoading={isEditMode ? isUpdateLoading : isCreateLoading}
        type="confirm"
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmCreateOrUpdate}
      />
    </div>
  );
};
