import { memo } from "react";
import { ErrorMessage } from "./forms/ErrorMessage";
import { InputWrapper } from "./forms/InputWrapper";
import { Input } from "./forms/Input";
import { Label } from "./forms/Label"

const InputText = ({ id, label, value, onChange, disabled, placeholder, autocomplete, hasError, errorMessage, required }: any) => {
  console.log("InputText render!");

  return (
    <div className="flex flex-col gap-1">
      <Label id={id} label={label} required={required} />
      <InputWrapper hasError={hasError} disabled={disabled}>
        <Input 
          type="text"
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autocomplete={autocomplete}
          readonly={disabled}
        />
      </InputWrapper>
      <ErrorMessage hasError={hasError} errorMessage={errorMessage} />
    </div>
  )
}

export const MemoizedInputText = memo(InputText);
