export const InputEmail = ({ id, label, value, onChange, isLoading, placeholder, pattern, title, autocomplete }: any) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-paper font-semibold select-none">{label}</label>
    <div className={`border-3 h-10 border-paper rounded-2xl p-2 text-paper focus-within:border-teal-light flex items-center gap-2 ${isLoading ? 'bg-paper/10 cursor-not-allowed' : 'bg-transparent'}`}>
      <input 
        type="email" 
        id={id} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
        readOnly={isLoading}
        pattern={pattern}
        title={title}
        className="flex-1 bg-transparent text-paper outline-none"
        autoComplete={autocomplete}
        required
      />

    </div>
  </div>
);
