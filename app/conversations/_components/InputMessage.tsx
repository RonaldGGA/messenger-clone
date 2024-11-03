import clsx from "clsx";
import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputMessageProps {
  id: string;
  register: UseFormRegister<FieldValues>;
  placeholder?: string;
  type?: string;
  errors?: FieldErrors;
  required?: boolean;
  label?: string;
  className?: string;
  disabled?: boolean;
}

const InputMessage: React.FC<InputMessageProps> = ({
  id,
  register,
  placeholder,
  type,
  required,
  label,
  className,
  disabled,
}) => {
  return (
    <>
      <label className="block" htmlFor={id}>
        {label}
      </label>
      <input
        required={required}
        disabled={disabled}
        type={type || "text"}
        {...register(id, { required })}
        placeholder={placeholder}
        className={clsx(
          "flex-1 rounded-full p-2 bg-slate-100 text-sm border focus:outline-1 focus:outline-slate-300  overflow-y-scroll transition max-h-[100px] resize-none",
          className
        )}
      />
    </>
  );
};

export default InputMessage;
