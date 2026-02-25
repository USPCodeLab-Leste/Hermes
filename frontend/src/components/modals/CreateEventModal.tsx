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

// API
import { useCreateEvent } from "../../hooks/events/useCreateEvent";
import { useNavigate } from "react-router-dom";

export function CreateEventModal({
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
      <CreateEventModalContent onClose={onClose} onCreated={onCreated} />
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
}: {
  onClose: () => void;
  onCreated?: () => void;
}) => {
  const navigate = useNavigate();
  const [createEvent, isCreatingLoading, createError] = useCreateEvent();

  const [confirmed, setConfirmed] = useState({
    clickCount: 0,
    isConfirmed: false,
  });

  const [errors, setErrors] = useState(structuredClone(defaultFormErrors));
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    local: "",
    data_inicio: "", // datetime-local
    data_fim: "", // datetime-local
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

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;

      resetConfirm();
      setFormData((prev) => ({ ...prev, [id]: value }));
      setErrors((prev) => ({
        ...prev,
        [id]: { hasError: false, message: "" },
      }));
    },
    [resetConfirm],
  );

  const handleBannerChange = useCallback(
    (file: File | null) => {
      resetConfirm();
      setBannerFile(file);
      setErrors((prev) => ({
        ...prev,
        img_banner: { hasError: false, message: "" },
      }));
    },
    [resetConfirm],
  );

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

    if (!bannerFile) {
      newErrors.img_banner = {
        hasError: true,
        message: "O banner é obrigatório.",
      };
      hasLocalError = true;
    } else if (!bannerFile.type.startsWith("image/")) {
      newErrors.img_banner = {
        hasError: true,
        message: "O arquivo deve ser uma imagem.",
      };
      hasLocalError = true;
    } else if (bannerFile.size > 5 * 1024 * 1024) {
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
  }, [formData, tagsArray, bannerFile]);

  useEffect(() => {
    if (!createError) return;

    const anyError = createError as any;
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
  }, [createError]);

  // Valida os dados e simula/confirma a criação do evento
  const handleCreate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

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
    formData,
    isCreatingLoading,
    onClose,
    onCreated,
    tagsArray,
    validate,
  ]);

  return (
    <div className="flex flex-col gap-4">
        <form onSubmit={handleCreate} className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[60dvh]">
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
            disabled={isCreatingLoading}
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
                disabled={isCreatingLoading}
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
            disabled={isCreatingLoading}
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
                disabled={isCreatingLoading}
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
                disabled={isCreatingLoading}
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
            disabled={isCreatingLoading}
            tooltip="A proporção ideal para o banner é 16:9 (ex: 1920x1080)"
          />

          {/* Tags */}
          <InputText
            id="tags"
            label="Tags (separe por vírgula)"
            value={formData.tags}
            onChange={handleChange}
            placeholder="CodeLab, SI"
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
              ? "Criar Evento"
              : isCreatingLoading
                ? "Criando evento..."
                : "Confirmar Criação"}
          </span>
        </GenericButton>
      </form>
    </div>
  );
};
