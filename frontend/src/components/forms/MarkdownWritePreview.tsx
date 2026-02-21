import { useCallback, useEffect, useRef, useState } from "react";

import MarkdownRenderer from "../MarkdownRenderer";
import { ErrorMessage } from "./ErrorMessage";
import { Label } from "./Label";

import ShowIcon from "../../assets/icons/watch.svg?react";
import PencilIcon from "../../assets/icons/pencil.svg?react";

import { uploadBannerAndGetUrl } from "../../utils/files";

interface MarkdownWritePreviewProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  hasError?: boolean;
  errorMessage?: string;
}

export function MarkdownWritePreview({
  id,
  label,
  value,
  onChange,
  disabled,
  required,
  placeholder,
  hasError,
  errorMessage,
}: MarkdownWritePreviewProps) {
  const [isPreview, setIsPreview] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const latestValueRef = useRef(value);

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  const emitValue = useCallback((nextValue: string) => {
    onChange({target: { id, value: nextValue }} as React.ChangeEvent<HTMLTextAreaElement>);
  },[id, onChange]);

  const insertAtSelection = useCallback((insertText: string) => {
    const textarea = textareaRef.current;
    const currentValue = latestValueRef.current;

    const selectionStart = textarea?.selectionStart ?? currentValue.length;
    const selectionEnd = textarea?.selectionEnd ?? currentValue.length;

    const nextValue = currentValue.slice(0, selectionStart) + insertText + currentValue.slice(selectionEnd);

    emitValue(nextValue);

    requestAnimationFrame(() => {
      const nextCursor = selectionStart + insertText.length;
      textareaRef.current?.setSelectionRange(nextCursor, nextCursor);
    });

    return { selectionStart, selectionEnd };
  }, [emitValue]);

  const makeTokenId = useCallback(() => {
    try {
      return `__uploading_image_${crypto.randomUUID()}__`;
    } catch {
      return `__uploading_image_${Date.now()}_${Math.random().toString(16).slice(2)}__`;
    }
  }, []);

  const handlePaste = useCallback(async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (disabled) return;

    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find((item) => item.kind === "file" && item.type.startsWith("image/"));

    if (!imageItem) return;

    const file = imageItem.getAsFile();
    if (!file) return;

    e.preventDefault();

    const tokenId = makeTokenId();
    const placeholderMarkdown = `![carregando imagem...](${tokenId})`;
    insertAtSelection(placeholderMarkdown);

    try {
      const imageUrl = await uploadBannerAndGetUrl(file);

      const currentValue = latestValueRef.current;
      if (!currentValue.includes(tokenId)) {
        return;
      }

      const nextValue = currentValue.replace(placeholderMarkdown,`![](${imageUrl})`);
      emitValue(nextValue);
    } catch (error) {
      const currentValue = latestValueRef.current;
      const nextValue = currentValue.includes(tokenId)
        ? currentValue.replace(
            placeholderMarkdown,
            "[erro ao enviar imagem]",
          )
        : currentValue;

      emitValue(nextValue);
    }
  }, [disabled, emitValue, insertAtSelection, makeTokenId]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <Label id={id} label={label} required={required} />
        <MarkdownModeSwitch
          isPreview={isPreview}
          setIsPreview={setIsPreview}
          disabled={disabled}
        />
      </div>

      <div
        className={`
          border-3 rounded-2xl p-2 bg-transparent transition-colors duration-300
          ${hasError ? "border-red-300 text-red-200" : "border-paper text-paper focus-within:border-teal-light"}
        `}
      >
        {isPreview ? (
          <div className="h-40 overflow-auto">
            <MarkdownRenderer>
              {value}
            </MarkdownRenderer>
          </div>
        ) : (
          <textarea
            id={id}
            value={value}
            onChange={onChange}
            onPaste={handlePaste}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none w-full resize-none h-40 overflow-auto"
            disabled={disabled}
            ref={textareaRef}
          />
        )}
      </div>

      <ErrorMessage hasError={hasError} errorMessage={errorMessage} />
    </div>
  );
}

function MarkdownModeSwitch({
  isPreview,
  setIsPreview,
  disabled,
}: {
  isPreview: boolean;
  setIsPreview: (isPreview: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center border-2 border-violet-light rounded-md mr-2">
      <ModeButton
        isActive={!isPreview}
        onClick={() => setIsPreview(false)}
        ariaPressed={!isPreview}
        activeClass="bg-teal-light/70 hover:bg-teal-light/80"
        disabled={disabled}
      >
        <PencilIcon className="size-4 text-paper" />
        <span className="text-[12px]">Editar</span>
      </ModeButton>

      <ModeButton
        isActive={isPreview}
        onClick={() => setIsPreview(true)}
        ariaPressed={isPreview}
        activeClass="bg-teal-light/70 hover:bg-teal-light/80"
        disabled={disabled}
      >
        <ShowIcon className="size-4 text-paper" />
        <span className="text-[12px]">Exibir</span>
      </ModeButton>
    </div>
  );
}

function ModeButton({
  isActive,
  onClick,
  children,
  ariaPressed,
  activeClass,
  disabled,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  ariaPressed: boolean;
  activeClass: string;
  disabled?: boolean;
}) {
  const baseButtonClass =
    "px-3 py-1.5 font-medium flex justify-center items-center gap-1 text-sm hover:shadow-2xl hover:outline-paper focus:outline-paper outline-transparent transition-all";

  const disabledClass = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseButtonClass} ${disabledClass} ${
        isActive ? activeClass : "bg-transparent"
      }`}
      aria-pressed={ariaPressed}
    >
      {children}
    </button>
  );
}