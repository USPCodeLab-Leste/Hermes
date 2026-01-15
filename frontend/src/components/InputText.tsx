export const InputText = ({ id, label, value, onChange, disabled, placeholder, autocomplete, required }: any) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-white font-semibold">{label}</label>
    <input 
      type="text" 
      id={id} 
      value={value} 
      onChange={onChange} 
      disabled={disabled} 
      placeholder={placeholder} 
      className="border-3 border-white rounded-2xl p-2 text-white bg-transparent" 
      autoComplete={autocomplete}
      required={required}
    />
  </div>
);
