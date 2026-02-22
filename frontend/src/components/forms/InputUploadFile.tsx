import { useCallback, useRef, useState } from "react";
import { Label } from "./Label";
import { ErrorMessage } from "./ErrorMessage";

// Icons
import UploadIcon from "../../assets/icons/upload.svg?react";
import { Tooltip } from "../Tooltip";
// import CloseIcon from "../../assets/icons/close.svg?react";

interface InputUploadFileProps {
  id: string;
  label: string;
  hasError?: boolean;
  errorMessage?: string;
  required?: boolean;
  accept: string;
  selectedFile: File | null;
  disabled?: boolean;
  changeSelectedFile: (file: File | null) => void;
  tooltip?: string;
}
 
 export function InputUploadFile({ id, label, hasError, errorMessage, required, accept, selectedFile, disabled, tooltip, changeSelectedFile }: InputUploadFileProps) {

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        changeSelectedFile(e.target.files[0]);
      }
    },
    [changeSelectedFile],
  );

  const onChooseFile = useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(true);
    },
    [disabled]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
    },
    [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();

      setIsDragActive(false);
    },
    [disabled]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();

      setIsDragActive(false);

      const file = e.dataTransfer.files?.[0] ?? null;
      if (file) changeSelectedFile(file);
    },
    [changeSelectedFile, disabled],
  );

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row items-center gap-2">
        <Label id={id} label={label} required={required} />
        {tooltip && <Tooltip content={tooltip} />}
      </div>
      <input
        type="file"
        accept={accept}
        id={id}
        onChange={handleChange}
        disabled={disabled}
        ref={inputRef}
        style={{ display: "none" }}
      />

      <button 
        type="button" 
        onClick={onChooseFile} 
        disabled={disabled}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col gap-4 justify-center items-center p-8 rounded-2xl
                   border-3 border-dashed text-ink/75 dark:text-paper/75 group 
                   ${hasError ? "border-red-300" : isDragActive ? "border-teal-light" : " border-ink/50 dark:border-paper/50"}
                   ${isDragActive ? "cursor-grabbing" : "cursor-pointer"} 
                   `}
      >
        <UploadIcon className={`size-14 rounded-full p-3.5 ${isDragActive ? "bg-teal-mid" : "dark:bg-violet-dark bg-violet-light"} group-hover:dark:bg-violet-dark/75 group-hover:bg-violet-light/75 transition-colors pointer-events-none`} />
        <span className="font-medium pointer-events-none">
          {selectedFile
            ? selectedFile.name
            : isDragActive
              ? "Solte o Arquivo aqui"
              : "Enviar Arquivo"
          }
        </span>
      </button>

      <ErrorMessage hasError={hasError} errorMessage={errorMessage} />
    </div>
  )
}