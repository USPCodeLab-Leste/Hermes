export const InputText = ({ id, label, value, onChange, disabled, placeholder, autocomplete, hasError }: any) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-paper font-semibold select-none">{label}</label>
    <div
      className={` border-3 h-10 rounded-2xl p-2 bg-transparent flex items-center gap-2 transition-colors duration-300
        ${hasError
          ? 'border-red-300 text-red-800' // Visual de Erro
          : 'border-paper text-paper focus-within:border-teal-light' // Visual Padrão
        }`}
    >
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-paper outline-none appearance-none"
        autoComplete={autocomplete}
      />
    </div>

  </div>
);
