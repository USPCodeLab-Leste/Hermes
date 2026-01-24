export const InputText = ({ id, label, value, onChange, disabled, placeholder, autocomplete, required }: any) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-paper font-semibold select-none">{label}</label>
    <div className="border-3 h-10 border- rounded-2xl p-2 text-paper bg-transparent focus-within:border-teal-light flex items-center gap-2">
      <input 
        type="text" 
        id={id} 
        value={value} 
        onChange={onChange} 
        disabled={disabled} 
        placeholder={placeholder} 
        className="flex-1 bg-transparent text-paper outline-none appearance-none"
        autoComplete={autocomplete}
        required={required}
      />
    </div>

  </div>
);
