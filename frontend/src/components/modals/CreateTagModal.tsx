import { useCallback, useState } from "react";
import { toast } from "react-toastify";

// Components
import { ModalWrapper } from "./Modal";
import { GenericButton } from "../GenericButton";
import { MemoizedInputText as InputText } from "../forms/InputText";
import { Label } from "../forms/Label";
import { InputWrapper } from "../forms/InputWrapper";
import { ErrorMessage } from "../forms/ErrorMessage";

// Types
import { eventTypes, infoTypes, type EventTagType, type InfoTagType, type TagType } from "../../types/tag";

// Hooks
import { useCreateTag } from "../../hooks/tags/useCreateTag";

interface CreateTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export function CreateTagModal({ isOpen, onClose, onCreated }: CreateTagModalProps) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <CreateTagModalContent onClose={onClose} onCreated={onCreated} />
    </ModalWrapper>
  );
}

const defaultErrors = {
  name: { hasError: false, message: "" },
  type: { hasError: false, message: "" },
};

function CreateTagModalContent({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated?: () => void;
}) {
  const [createTag, isCreating] = useCreateTag();

  const [isEventTag, setIsEventTag] = useState(true);
  const [eventType, setEventType] = useState<EventTagType>(eventTypes[0]);
  const [infoType, setInfoType] = useState<InfoTagType>(infoTypes[0]);
  const [name, setName] = useState("");
  const [errors, setErrors] = useState(structuredClone(defaultErrors));

  const handleToggleScope = useCallback((scope: "event" | "info") => {
    setIsEventTag(scope === "event");
    setErrors(structuredClone(defaultErrors));
  }, []);

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as TagType;

    if (isEventTag) {
      setEventType(value as EventTagType);
    } else {
      setInfoType(value as InfoTagType);
    }

    setErrors((prev) => ({
      ...prev,
      type: { hasError: false, message: "" },
    }));
  }, [isEventTag]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setErrors((prev) => ({
      ...prev,
      name: { hasError: false, message: "" },
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (isCreating) return;

    const trimmedName = name.trim();
    const selectedType: TagType = isEventTag ? eventType : infoType;

    const nextErrors = structuredClone(defaultErrors);
    let hasError = false;

    if (!trimmedName) {
      nextErrors.name = {
        hasError: true,
        message: "O nome da tag é obrigatório.",
      };
      hasError = true;
    }

    if (!selectedType) {
      nextErrors.type = {
        hasError: true,
        message: "Selecione um tipo para a tag.",
      };
      hasError = true;
    }

    if (hasError) {
      setErrors(nextErrors);
      return;
    }

    try {
      await createTag({
        name: trimmedName,
        type: selectedType.toLowerCase() as TagType,
      });

      toast.success("Tag criada com sucesso!");
      onCreated?.();
      onClose();

      setName("");
      setIsEventTag(true);
      setEventType(eventTypes[0]);
      setInfoType(infoTypes[0]);
      setErrors(structuredClone(defaultErrors));
    } catch (error) {
      toast.error("Erro ao criar tag");
    }
  }, [createTag, eventType, infoType, isCreating, isEventTag, name, onClose, onCreated]);

  const availableTypes = isEventTag ? eventTypes : infoTypes;
  const currentType = isEventTag ? eventType : infoType;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Escopo: evento ou informação */}
      <div className="flex flex-col gap-2">
        <Label label="Escopo" id="tag-scope" />
        <div className="inline-flex border-2 border-violet-light rounded-md overflow-hidden w-max">
          <button
            type="button"
            onClick={() => handleToggleScope("event")}
            className={`px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              isEventTag
                ? "bg-teal-light/70"
                : "bg-transparent"
            }`}
            disabled={isCreating}
          >
            Evento
          </button>
          <button
            type="button"
            onClick={() => handleToggleScope("info")}
            className={`px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              !isEventTag
                ? "bg-teal-light/70"
                : "bg-transparent"
            }`}
            disabled={isCreating}
          >
            Informação
          </button>
        </div>
      </div>

      {/* Select de tipo */}
      <div className="flex flex-col gap-1">
        <Label id="tag-type" label="Categoria" required={true} />
        <InputWrapper hasError={errors.type.hasError}>
          <select
            id="tag-type"
            className="w-full bg-transparent outline-none cursor-pointer"
            value={currentType}
            onChange={handleTypeChange}
            disabled={isCreating}
          >
            {availableTypes.map((type) => {
              const displayText = type.charAt(0).toUpperCase() + type.slice(1);
              return (
                <option key={type} value={type} className="bg-violet-light text-ink capitalize">
                  {displayText}
                </option>
              )
            })}
          </select>
        </InputWrapper>
        <ErrorMessage hasError={errors.type.hasError} errorMessage={errors.type.message} />
      </div>

      {/* Nome da tag */}
      <InputText
        id="tag-name"
        label="Nome da Tag"
        value={name}
        onChange={handleNameChange}
        placeholder="SI"
        autocomplete="off"
        hasError={errors.name.hasError}
        errorMessage={errors.name.message}
        disabled={isCreating}
        required={true}
      />

      <GenericButton type="submit" disabled={isCreating}>
        <span className="text-paper">
          {isCreating ? "Criando tag..." : "Criar Tag"}
        </span>
      </GenericButton>
    </form>
  );
}
