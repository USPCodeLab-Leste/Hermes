interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const defaultStyle = "bg-teal-mid hover:bg-teal-light"

export const GenericButton = ({ children, className, onClick, disabled, type }: ButtonProps) => {
  return (
    <button
      type={type || 'button'}
      className={`p-4 rounded-xl transition-colors duration-300 ease-in-out ${className ?? defaultStyle} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}