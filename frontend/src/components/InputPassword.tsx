import { useState, useEffect, memo } from 'react';
import { Label } from './forms/Label';

import Watch from '../assets/icons/watch.svg?react';
import WatchOff from '../assets/icons/watch-off.svg?react';
import { Input } from './forms/Input';
import { ErrorMessage } from './forms/ErrorMessage';
import { InputWrapper } from './forms/InputWrapper';

interface ValidationInfo {
  id: number;
  isValid: boolean;
  message: string;
}

const InputPassword = ({ id, label, value, onChange, disabled, placeholder, validation, autocomplete, onValidationChange, hasError, errorMessage, required }: any) => {
  const [visible, setVisible] = useState(false);

  const validations: ValidationInfo[] = [
    {
      id: 1,
      isValid: value.length >= 8,
      message: "Mínimo de 8 caracteres",
    },
    {
      id: 2,
      isValid: /[A-Za-z]/.test(value),
      message: "Pelo menos uma letra",
    },
    {
      id: 3,
      isValid: /[0-9]/.test(value),
      message: "Pelo menos um número",
    },
    {
      id: 4,
      isValid: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      message: "Pelo menos um caracter especial",
    },
  ];

  const allValid = validations.every(v => v.isValid);

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validation ? allValid : true);
    }
  }, [allValid, onValidationChange, validation]);

  const showVisualError = hasError || (validation && !allValid && value.length > 0);

  console.log("InputPassword render!");

  return (
    <div className="flex flex-col gap-1">
      <Label id={id} label={label} required={required} />

      <InputWrapper hasError={showVisualError} disabled={disabled}>
        <Input 
          type={visible ? "text" : "password"}
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          autocomplete={autocomplete}
        />

        {value && (
          <ShowPassword
            Icon={visible ? WatchOff : Watch}
            onClick={() => setVisible(!visible)}
          />
        )}
      </InputWrapper>

      <ErrorMessage hasError={hasError} errorMessage={errorMessage} />

      {validation && <Validation validations={validations} />}

    </div>
  );
}

const Validation = ({validations}: { validations: ValidationInfo[] }) => (
  <div className="mt-3 bg-white/5 p-3 rounded-lg border border-white/10">
    <p className="text-xs font-semibold text-paper/80 mb-2 uppercase tracking-wide">
      Sua senha deve ter:
    </p>
    <ul className="space-y-2">
      {validations.map((item) => (
        <li
          key={item.id}
          className={`flex items-center text-sm transition-all duration-300 ${item.isValid
            ? 'text-green-600 font-medium translate-x-1'
            : 'text-paper/80'
          }`}
        >
          {/* Ícone */}
          <div className={`mr-2 shrink-0 flex items-center justify-center w-5 h-5 rounded-full border transition-colors duration-300 ${item.isValid
            ? 'bg-green-100 border-green-700' // Ícone de check verde
            : 'bg-transparent border-paper/80' // Círculo cinza
            }`}>
            {item.isValid ? (
              <CheckIcon />
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-paper/80" /> // Bolinha central
            )}
          </div>

          <span className={item.isValid ? "line-through opacity-80" : ""}>
            {item.message}
          </span>
        </li>
      ))}
    </ul>
  </div>
)

const CheckIcon = () => (
  <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ShowPassword = ({ Icon, onClick }: { Icon: React.FC<React.SVGProps<SVGSVGElement>>, onClick: () => void }) => (
  <button type="button" onClick={onClick} tabIndex={-1} className="focus:outline-none">
    <Icon className='cursor-pointer hover:text-teal-light active:text-teal-light transition-colors w-5 h-5' />
  </button>
);

export const MemoizedInputPassword = memo(InputPassword);