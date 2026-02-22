interface ButtonProps {
  waiting: boolean
  text: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
}

export function SubmitButton({ waiting, text, type = "submit", className, onClick }: ButtonProps) {
  return (
    <button 
      className={`w-2/3 text-paper text-lg font-bold bg-teal-light p-2 rounded-2xl self-center hover:bg-teal-mid transition-colors select-none ${className || ""} ${waiting ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      type={type}
      disabled={waiting}
      onClick={onClick}
    >
      {text}
    </button>
  )
}