interface ButtonProps {
  waiting: boolean
  text: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export function SubmitButton({ waiting, text, type = "submit", onClick }: ButtonProps) {
  return (
    <button 
      className={`w-2/3 text-paper text-lg font-bold bg-teal-light p-2 rounded-2xl self-center hover:bg-teal-mid transition-colors select-none ${waiting ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      type={type}
      disabled={waiting}
      onClick={onClick}
    >
      {text}
    </button>
  )
}