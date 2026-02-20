import { useRef } from "react";
import { Label } from "./Label";
import { ErrorMessage } from "./ErrorMessage";

// Icons
import UploadIcon from "../../assets/icons/upload.svg?react";
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
}
 
 export function InputUploadFile({ id, label, hasError, errorMessage, required, accept, selectedFile, disabled, changeSelectedFile }: InputUploadFileProps) {

  const inputRef = useRef(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      changeSelectedFile(e.target.files[0]);
    }
  }

  const onChooseFile = () => {
    if (inputRef.current) {
      (inputRef.current as HTMLInputElement).click();
    }
  }

  // const removeFile = () => {
  //   changeSelectedFile(null);
  // }

  return (
    <div className="flex flex-col gap-1">
      <Label id={id} label={label} required={required} />
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
        className={`flex flex-col gap-4 justify-center items-center p-8 rounded-2xl
                   border-3 border-dashed text-ink/75 dark:text-paper/75 group
                   ${hasError ? "border-red-300" : " border-ink/50 dark:border-paper/50"}
                   `}
      >
        <UploadIcon className="size-14 rounded-full bg-violet-dark p-3.5 group-hover:bg-violet-dark/75 transition-colors" />
        <span className="font-medium">{selectedFile ? selectedFile.name : "Enviar Arquivo"}</span>
      </button>

      {/* {selectedFile && (
        <div className="flex items-center gap-2 justify-between rounded-2xl border-3 border-paper p-2">
          <span>{selectedFile.name}</span>
          <button type="button" onClick={removeFile} className="ml-2">
            <CloseIcon className="size-5" />
          </button>
        </div>
      )} */}
      <ErrorMessage hasError={hasError} errorMessage={errorMessage} />
      
    </div>
  )
}