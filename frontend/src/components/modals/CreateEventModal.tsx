import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

// Componentes
import { GenericButton } from "../GenericButton";
import { InputUploadFile } from "../forms/InputUploadFile";
import { ErrorMessage } from "../forms/ErrorMessage";
import { MemoizedInputText as InputText } from "../forms/InputText";
import { Input } from "../forms/Input";
import { InputWrapper } from "../forms/InputWrapper";
import { Label } from "../forms/Label";
import { ModalWrapper } from "./Modal";
import { SelectTags } from "../Events";

// API
import { useCreateEvent } from "../../hooks/events/useCreateEvent";
import { useUpdateEvent } from "../../hooks/events/useUpdateEvent";
import { useNavigate } from "react-router-dom";
import type { Event } from "../../types/events";
import { useEventTags } from "../../hooks/tags/useEventTags";
import type { ActiveTags, GenericTag } from "../../types/tag";

export function CreateEventModal({
  isOpen,
  onClose,
  onCreated,
  initialEvent,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
  initialEvent?: Event | null;
}) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <CreateEventModalContent onClose={onClose} onCreated={onCreated} initialEvent={initialEvent ?? null} />
    </ModalWrapper>
  );
}

const defaultFormErrors = {
  title: { hasError: false, message: "" },
  body: { hasError: false, message: "" },
  local: { hasError: false, message: "" },
  data_inicio: { hasError: false, message: "" },
  data_fim: { hasError: false, message: "" },
  img_banner: { hasError: false, message: "" },
  tags: { hasError: false, message: "" },
};

const CreateEventModalContent = ({
  onClose,
  onCreated,
  initialEvent,
}: {
  onClose: () => void;
  onCreated?: () => void;
  initialEvent: Event | null;
}) => {
  const navigate = useNavigate();
  const [createEvent, isCreateLoading, createError] = useCreateEvent();
  const [updateEvent, isUpdateLoading, updateError] = useUpdateEvent();

  const [confirmed, setConfirmed] = useState({
    clickCount: 0,
    isConfirmed: false,
  });

  const [errors, setErrors] = useState(structuredClone(defaultFormErrors));
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [existingBannerUrl, setExistingBannerUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    local: "",
    data_inicio: "", // datetime-local
    data_fim: "", // datetime-local
  });

  const { data: availableTags = [], isLoading: isLoadingTags } = useEventTags(true);
  const [activeTags, setActiveTags] = useState<ActiveTags>({} as ActiveTags);

  const isEditMode = Boolean(initialEvent);

  useEffect(() => {
    if (!initialEvent) return;

    setFormData({
      title: initialEvent.title ?? "",
      body: initialEvent.body ?? "",
      local: initialEvent.local ?? "",
      data_inicio: initialEvent.data_inicio ? initialEvent.data_inicio.slice(0, 16) : "",
      data_fim: initialEvent.data_fim ? initialEvent.data_fim.slice(0, 16) : "",
    });

    const initialActiveTags: ActiveTags = {};
    (initialEvent.tags ?? []).forEach((tag) => {
      initialActiveTags[tag.id] = tag as GenericTag;
    });
    setActiveTags(initialActiveTags);

    setExistingBannerUrl(initialEvent.img_banner ?? null);
  }, [initialEvent]);

  const tagsArray = useMemo(() => Object.values(activeTags).map((tag) => tag.name), [activeTags]);

  const resetConfirm = useCallback(() => {
    setConfirmed({ clickCount: 0, isConfirmed: false });
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;

    resetConfirm();
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({
      ...prev,
      [id]: { hasError: false, message: "" },
    }));
  }, [resetConfirm]);

  const handleBannerChange = useCallback((file: File | null) => {
    resetConfirm();
    setBannerFile(file);
    setErrors((prev) => ({
      ...prev,
      img_banner: { hasError: false, message: "" },
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
  }, []);

  // Valida cada um dos campos manualmente
  const validate = useCallback(() => {
    let hasLocalError = false;
    const newErrors = structuredClone(defaultFormErrors);

    if (formData.title.trim() === "") {
      newErrors.title = { hasError: true, message: "O título é obrigatório." };
      hasLocalError = true;
    } else if (formData.title.trim().length < 3) {
      newErrors.title = {
        hasError: true,
        message: "O título deve conter ao menos 3 caracteres.",
      };
      hasLocalError = true;
    }

    if (formData.body.trim() === "") {
      newErrors.body = {
        hasError: true,
        message: "A descrição é obrigatória.",
      };
      hasLocalError = true;
    } else if (formData.body.trim().length < 10) {
      newErrors.body = {
        hasError: true,
        message: "A descrição deve conter ao menos 10 caracteres.",
      };
      hasLocalError = true;
    } else if (formData.body.trim().length > 1000) {
      newErrors.body = {
        hasError: true,
        message: "A descrição deve conter no máximo 1000 caracteres.",
      };
      hasLocalError = true;
    }

    if (formData.local.trim() === "") {
      newErrors.local = { hasError: true, message: "O local é obrigatório." };
      hasLocalError = true;
    } else if (formData.local.trim().length < 3) {
      newErrors.local = {
        hasError: true,
        message: "O local deve conter ao menos 3 caracteres.",
      };
      hasLocalError = true;
    } else if (formData.local.trim().length > 100) {
      newErrors.local = {
        hasError: true,
        message: "O local deve conter no máximo 100 caracteres.",
      };
      hasLocalError = true;
    }

    if (formData.data_inicio.trim() === "") {
      newErrors.data_inicio = {
        hasError: true,
        message: "A data de início é obrigatória.",
      };
      hasLocalError = true;
    }

    if (formData.data_fim.trim() === "") {
      newErrors.data_fim = {
        hasError: true,
        message: "A data de fim é obrigatória.",
      };
      hasLocalError = true;
    }

    if (formData.data_inicio && formData.data_fim) {
      const start = new Date(formData.data_inicio).getTime();
      const end = new Date(formData.data_fim).getTime();
      if (Number.isFinite(start) && Number.isFinite(end) && end <= start) {
        newErrors.data_fim = {
          hasError: true,
          message: "A data de fim deve ser após o início.",
        };
        hasLocalError = true;
      }
    }

    const hasExistingImage = Boolean(existingBannerUrl);

    if (!bannerFile && !hasExistingImage) {
      newErrors.img_banner = {
        hasError: true,
        message: "O banner é obrigatório.",
      };
      hasLocalError = true;
    } else if (bannerFile && !bannerFile.type.startsWith("image/")) {
      newErrors.img_banner = {
        hasError: true,
        message: "O arquivo deve ser uma imagem.",
      };
      hasLocalError = true;
    } else if (bannerFile && bannerFile.size > 5 * 1024 * 1024) {
      newErrors.img_banner = {
        hasError: true,
        message: "A imagem deve ser menor que 5MB.",
      };
      hasLocalError = true;
    }

    if (tagsArray.length === 0) {
      newErrors.tags = {
        hasError: true,
        message: "Informe ao menos UMA tag (separadas por vírgula).",
      };
      hasLocalError = true;
    }

    if (hasLocalError) {
      setErrors(newErrors);
      return false;
    }

    return true;
  }, [formData, tagsArray, bannerFile, existingBannerUrl]);

  useEffect(() => {
    const activeError = (isEditMode ? updateError : createError) as any;
    if (!activeError) return;

    const anyError = activeError as any;
    const status = anyError.status;
    const message = (anyError && anyError.message) || "Não foi possível criar o evento.";

    if (status === 400) {
      toast.error("Dados inválidos. Verifique os campos e tente novamente.");
    } else if (status === 401) {
      toast.error("Não autenticado");
      onClose()
      navigate("/auth/login");
    } else if (status === 403) {
      toast.error("Acesso restrito a adminsitradores");
      onClose()
      navigate("/");
    } else {
      toast.error(message);
    }
  }, [createError, updateError, isEditMode]);

  // Valida os dados e simula/confirma a criação do evento
  const handleCreate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

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
      if (isEditMode && initialEvent) {
        await updateEvent({
          id: initialEvent.id,
          title: formData.title,
          body: formData.body,
          local: formData.local,
          data_inicio: formData.data_inicio,
          data_fim: formData.data_fim,
          tags: tagsArray,
          bannerFile: bannerFile ?? null,
          existingBannerUrl,
        });

        toast.success("Evento atualizado com sucesso!");
      } else {
        await createEvent({
          title: formData.title,
          body: formData.body,
          local: formData.local,
          data_inicio: formData.data_inicio,
          data_fim: formData.data_fim,
          tags: tagsArray,
          bannerFile: bannerFile!,
        });

        toast.success("Evento criado com sucesso!");
      }

      onCreated?.();
      onClose();
      setConfirmed((prev) => ({ ...prev, isConfirmed: true }));
    } catch {
      // O erro já será tratado via useEffect observando createError
    }
  },
  [
    bannerFile,
    confirmed.clickCount,
    createEvent,
    updateEvent,
    formData,
    isCreateLoading,
    isUpdateLoading,
    existingBannerUrl,
    initialEvent,
    onClose,
    onCreated,
    tagsArray,
    validate,
    isEditMode,
  ]);

  return (
    <div className="flex flex-col gap-4">
        <form onSubmit={handleCreate} className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[60dvh] pb-2">
          {/* Título */}
          <InputText
            id="title"
            label="Título"
            value={formData.title}
            onChange={handleChange}
            placeholder="Workshop de Node.js"
            autocomplete="off"
            hasError={errors.title.hasError}
            errorMessage={errors.title.message}
            disabled={isCreateLoading}
            required={true}
          />

          {/* Body / descrição */}
          <div className="flex flex-col gap-1">
            <Label id="body" label="Descrição" required={true} />
            <div
              className={`
                border-3 rounded-2xl p-2 bg-transparent flex transition-colors duration-300
                ${
                  errors.body.hasError
                    ? "border-red-300 text-red-200"
                    : "focus-within:border-teal-light"
                }
              `}
            >
              <textarea
                id="body"
                value={formData.body}
                onChange={handleChange}
                placeholder="Evento sobre boas práticas em Node.js"
                className="flex-1 bg-transparent outline-none w-full resize-none min-h-24"
                disabled={isCreateLoading}
              />
            </div>
            <ErrorMessage
              hasError={errors.body.hasError}
              errorMessage={errors.body.message}
            />
          </div>

          {/* Local */}
          <InputText
            id="local"
            label="Local"
            value={formData.local}
            onChange={handleChange}
            placeholder="Auditório Central"
            autocomplete="off"
            hasError={errors.local.hasError}
            errorMessage={errors.local.message}
            disabled={isCreateLoading}
            required={true}
          />

          {/* Data início */}
          <div className="flex flex-col gap-1">
            <Label id="data_inicio" label="Data início" required={true} />
            <InputWrapper hasError={errors.data_inicio.hasError}>
              <Input
                type="datetime-local"
                id="data_inicio"
                value={formData.data_inicio}
                onChange={handleChange}
                autocomplete="off"
                disabled={isCreateLoading}
              />
            </InputWrapper>
            <ErrorMessage
              hasError={errors.data_inicio.hasError}
              errorMessage={errors.data_inicio.message}
            />
          </div>

          {/* Data fim */}
          <div className="flex flex-col gap-1">
            <Label id="data_fim" label="Data fim" required={true} />
            <InputWrapper hasError={errors.data_fim.hasError}>
              <Input
                type="datetime-local"
                id="data_fim"
                value={formData.data_fim}
                onChange={handleChange}
                autocomplete="off"
                disabled={isCreateLoading}
              />
            </InputWrapper>
            <ErrorMessage
              hasError={errors.data_fim.hasError}
              errorMessage={errors.data_fim.message}
            />
          </div>

          {/* Banner */}
          <InputUploadFile
            id="img_banner"
            label="Imagem (banner)"
            changeSelectedFile={handleBannerChange}
            selectedFile={bannerFile}
            accept="image/*"
            hasError={errors.img_banner.hasError}
            errorMessage={errors.img_banner.message}
            required={true}
            disabled={isCreateLoading}
            tooltip="A proporção ideal para o banner é 16:9 (ex: 1920x1080)"
            bannerUrl={existingBannerUrl}
          />

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
        
        <GenericButton type="submit" disabled={isCreateLoading}>
          <span className="text-paper">
            {confirmed.clickCount === 0
              ? (isEditMode ? "Salvar alterações" : "Criar Evento")
              : (isEditMode
                  ? (isUpdateLoading ? "Salvando..." : "Confirmar alterações")
                  : (isCreateLoading ? "Criando evento..." : "Confirmar Criação"))}
          </span>
        </GenericButton>
      </form>
    </div>
  );
};
