interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
  disabled?: boolean;
}

const defaultStyle = "bg-teal-mid hover:bg-teal-light"

export const GenericButton = ({ children, className, onClick, disabled }: ButtonProps) => {
  return (
    <button 
      className={`p-4 rounded-xl transition-colors duration-300 ease-in-out cursor-pointer 
                ${className ?? defaultStyle} 
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}