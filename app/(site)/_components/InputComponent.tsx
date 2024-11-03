import { Input } from "@/components/ui/input";
import clsx from "clsx";
import React from "react";
import { FieldValues, FieldErrors, UseFormRegister } from "react-hook-form";

interface InputComponentProps {
  id: string;
  errors: FieldErrors;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  disabled?: boolean;
}

const InputComponent: React.FC<InputComponentProps> = ({
  id,
  errors,
  label,
  type,
  placeholder,
  register,
  disabled,
  required,
}) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <Input
        autoComplete={id}
        disabled={disabled}
        placeholder={placeholder}
        type={type}
        id={id}
        {...register(id, { required })}
        className={clsx(errors[id] && "focus:ring-rose-500 outline-rose-500")}
      />
    </div>
  );
};

export default InputComponent;
