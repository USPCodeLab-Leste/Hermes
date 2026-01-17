export const InputEmail = ({ id, label, value, onChange, isLoading, placeholder, pattern, title, autocomplete }: any) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-white font-semibold select-none">{label}</label>
    <div className={`border-3 h-10 border-white rounded-2xl p-2 text-white focus-within:border-amber-400 flex items-center gap-2 ${isLoading ? 'bg-white/10 cursor-not-allowed' : 'bg-transparent'}`}>
      <input 
        type="email" 
        id={id} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
        readOnly={isLoading}
        pattern={pattern}
        title={title}
        className="flex-1 bg-transparent text-white outline-none"
        autoComplete={autocomplete}
        required
      />

    </div>
  </div>
);
