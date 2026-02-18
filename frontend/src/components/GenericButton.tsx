interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}

const defaultStyle = "bg-teal-mid hover:bg-teal-light"

export const GenericButton = ({ children, className, onClick }: ButtonProps) => {
  return (
    <button 
      className={`p-4 rounded-xl transition-colors duration-300 ease-in-out cursor-pointer ${className ?? defaultStyle}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}