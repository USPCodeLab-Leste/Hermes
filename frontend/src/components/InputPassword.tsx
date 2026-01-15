export const InputPassword = ({ id, label, value, onChange, disabled, placeholder }: any) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-white font-semibold">{label}</label>
    <input 
      type="password" id={id} 
      value={value} 
      onChange={onChange}
      disabled={disabled} 
      placeholder={placeholder} 
      className="border-3 border-white rounded-2xl p-2 text-white bg-transparent"
      required
    />
  </div>
);
