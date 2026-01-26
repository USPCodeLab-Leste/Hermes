interface InputProps {
  type: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  autocomplete?: string;
}

export function Input({type, id, value, onChange, disabled, placeholder, autocomplete, readonly}: InputProps) {
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
      className="flex-1 bg-transparent outline-none w-full"
    />
  )
}