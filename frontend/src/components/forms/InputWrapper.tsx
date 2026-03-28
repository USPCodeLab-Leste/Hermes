interface InputWrapperProps {
  children: React.ReactNode;
  hasError?: boolean;
  disabled?: boolean;
}

export function InputWrapper({ children, hasError, disabled }: InputWrapperProps) {
  return (
    <div
      className={`
        border-3 h-10 rounded-2xl p-2 bg-transparent flex items-center gap-2 transition-colors duration-300 has-autofill:bg-violet-light
        ${hasError
          ? 'dark:border-red-300 border-red-800 dark:text-red-200 text-red-800' // Visual de Erro
          : 'dark:border-paper border-ink dark:text-paper text-ink focus-within:border-teal-light' // Visual Padrão
        }
        ${disabled ? 'bg-paper/10 cursor-not-allowed' : 'bg-transparent'}
      `}
    >
      {children}
    </div>
  )
}