import { useState } from 'react';

import Watch from '../assets/icons/watch.svg?react';
import WatchOff from '../assets/icons/watch-off.svg?react';

export const InputPassword = ({ id, label, value, onChange, disabled, placeholder }: any) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-paper font-semibold select-none">{label}</label>
      <div className="border-3 h-10 border-paper rounded-2xl p-2 text-paper bg-transparent focus-within:border-teal-light flex items-center gap-2">
        <input 
          type={visible ? "text" : "password"} 
          id={id} 
          value={value} 
          onChange={onChange}
          disabled={disabled} 
          placeholder={placeholder} 
          className="flex-1"
          required
        />
        {value && (
          visible ? (
            <ShowPassword
              Icon={WatchOff}
              onClick={() => setVisible(false)}
            />
          ) : (
            <ShowPassword
              Icon={Watch}
              onClick={() => setVisible(true)}
            />
          )
        )}
      </div>
    </div>
  );
}

const ShowPassword = ({Icon, onClick}: {Icon: React.FC<React.SVGProps<SVGSVGElement>>, onClick: () => void}) => (
  <button
    type="button"
    onClick={onClick}
  >
    <Icon className='cursor-pointer hover:text-teal-light active:text-teal-light transition-colors' />
  </button>
);
