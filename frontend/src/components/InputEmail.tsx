export const InputEmail = ({ id, label, value, onChange, isLoading, placeholder, pattern, title, autocomplete }: any) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-white font-semibold">{label}</label>
    <input 
      type="email" 
      id={id} 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder}
      readOnly={isLoading}
      pattern={pattern}
      title={title}
      className={`border-3 border-white rounded-2xl p-2 text-white transition-colors duration-300 ${isLoading ? 'bg-white/10 cursor-not-allowed' : 'bg-transparent'}`} 
      autoComplete={autocomplete}
      required
    />
  </div>
);
