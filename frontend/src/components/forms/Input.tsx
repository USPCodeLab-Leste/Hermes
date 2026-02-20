interface InputProps {
  type: string;
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  readonly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  autocomplete?: string;
  accept?: string;
}

export function Input({type, id, value, onChange, disabled, placeholder, autocomplete, readonly, accept}: InputProps) {
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      formNoValidate={true}
      disabled={disabled}
      placeholder={placeholder}
      readOnly={readonly}
      autoComplete={autocomplete}
      accept={accept}
      className="flex-1 bg-transparent outline-none w-full"
    />
  )
}