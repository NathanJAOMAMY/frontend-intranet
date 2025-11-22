import { FC } from "react";
import { Icon } from "@iconify/react";

interface SelectFieldProps {
  label?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  icon?: string; // ex: "mdi:account"
  width?: string;
  className?: string;
  disabled?: boolean;
}

const SelectField: FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  icon,
  width = "w-full",
  className = "",
  disabled = false,
}) => {
  return (
    <div className={`${width} relative text-gray-800 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      {/* Icône gauche */}
      {icon && (
        <Icon
          icon={icon}
          className="absolute left-3 top-9 -translate-y-1/2 text-primary opacity-70 pointer-events-none"
          width={18}
        />
      )}

      {/* Flèche personnalisée */}
      <div className="pointer-events-none absolute right-3 top-9 -translate-y-1/2 text-primary">
        <Icon icon="mdi:chevron-down" width={20} />
      </div>

      {/* Sélecteur */}
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`appearance-none w-full border-2 border-primary p-2 ${
          icon ? "pl-10" : "pl-3"
        } pr-10 rounded-lg text-sm outline-none bg-white 
        text-gray-800 focus:border-primary hover:border-primary/80
        disabled:opacity-60 disabled:cursor-not-allowed transition-all`}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}

        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
