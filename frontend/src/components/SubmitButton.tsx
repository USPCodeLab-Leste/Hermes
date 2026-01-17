interface ButtonProps {
  waiting: boolean
  text: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export function SubmitButton({ waiting, text, type = "submit", onClick }: ButtonProps) {
  return (
    <button 
      className={`w-2/3 text-white text-lg font-bold bg-amber-400 p-2 mb-4 rounded-2xl m-auto hover:bg-amber-500 transition-colors select-none ${waiting ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      type={type}
      disabled={waiting}
      onClick={onClick}
    >
      {text}
    </button>
  )
}