import { useState, useEffect } from 'react';

import Watch from '../assets/icons/watch.svg?react';
import WatchOff from '../assets/icons/watch-off.svg?react';

export const InputPassword = ({ id, label, value, onChange, disabled, placeholder, validation, onValidationChange }: any) => {
  const [visible, setVisible] = useState(false);

  const validations = [
    {
      id: 1,
      isValid: value.length >= 8,
      message: "Mínimo de 8 caracteres",
    },
    {
      id: 2,
      isValid: /[A-Z]/.test(value),
      message: "Pelo menos uma letra maiúscula",
    },
    {
      id: 3,
      isValid: /[0-9]/.test(value),
      message: "Pelo menos um número",
    },
    {
      id: 4,
      isValid: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      message: "Pelo menos um cacacter especial",
    },
  ];

  const allValid = validations.every(v => v.isValid);

  useEffect(() => {
    if (onValidationChange) {
      // Se 'validation' for false (campo de confirmar senha), consideramos válido sempre
      // Se 'validation' for true, passamos o resultado real das regras
      onValidationChange(validation ? allValid : true);
    }
  }, [allValid, onValidationChange, validation]);

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

      {validation &&
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-500 mb-2">A senha deve conter:</p>
          <ul className="space-y-1">
            {validations.map((item) => (
              <li
                key={item.id}
                className={`flex items-center text-sm transition-colors duration-300 ${item.isValid ? 'text-green-600 font-medium' : 'text-gray-400'
                  }`}
              >
                <span className={`mr-2 w-4 h-4 flex items-center justify-center rounded-full border ${item.isValid ? 'bg-green-100 border-green-600' : 'border-gray-300'
                  }`}>
                  {item.isValid && (
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                {item.message}
              </li>
            ))}
          </ul>
        </div>
      }

    </div>
  );
}

const ShowPassword = ({ Icon, onClick }: { Icon: React.FC<React.SVGProps<SVGSVGElement>>, onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
  >
    <Icon className='cursor-pointer hover:text-teal-light active:text-teal-light transition-colors' />
  </button>
);
