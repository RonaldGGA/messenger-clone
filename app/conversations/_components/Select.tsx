"use client";
import { User } from "@prisma/client";
import React from "react";

import ReactSelect from "react-select";
// import { GroupBase } from "react-select";

// Define the Type for the options
// type OptionType = { value: string; label: string };

interface SelectProps {
  label: string;
  value?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: Record<string, any>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  disabled?: boolean;
  users: User[];
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  // users,
  disabled,
}) => {
  // const options: OptionType[] = [
  //   ...(users?.map((user) => ({
  //     value: user.id,
  //     label: user.name || "",
  //   })) || []),
  // ];

  // const options =
  //   users?.map((user) => ({
  //     value: user.id, // o user.id.toString() si id es un número
  //     label: user.name || "", // Asegúrate de que label nunca sea null o undefined
  //   })) || []; // Asegúrate de que opciones sea un array vacío si users es undefined.

  return (
    <div className="flex flex-col gap-1 ">
      <label htmlFor="react-select">{label}</label>
      <ReactSelect
        onChange={onChange}
        // options={options}
        value={value}
        isDisabled={disabled}
        isMulti={true}
        classNames={{
          control: () => "text-sm",
        }}
        styles={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          menuPortal: (base: any) => ({
            ...base,
            zIndex: 999,
          }),
        }}
        placeholder="Select multiple" // Agrega un placeholder si es necesario
        noOptionsMessage={() => "No options avaible"} // Manejo de opciones vacías
      />
    </div>
  );
};

export default Select;
