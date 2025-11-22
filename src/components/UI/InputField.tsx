import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiXCircle } from "react-icons/fi";
import { Icon } from "@iconify/react";
export const classInput = `w-full p-2 pl-3 pr-10 border-2 border-primary bg-white rounded-lg text-sm outline-none 
          focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed`;
interface InputFieldProps {
  label?: string;
  type?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: string; // nom d’icône @iconify/react (ex: "fe:search")
  showClear?: boolean; // afficher le bouton "X"
  width?: string; // ex: "w-full" ou "w-[40%]"
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

const InputField: FC<InputFieldProps> = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  icon,
  showClear = true,
  width = "w-full",
  className = "",
  disabled = false,
  required = false
}) => {
  return (
    <div className={`${width} flex flex-col relative text-gray-800 ${className}`}>

      {label && (
        <label
          htmlFor={name}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      {/* Icône à gauche */}
      {icon && (
        <Icon
          icon={icon}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-primary opacity-70"
          width={18}
        />
      )}
      <div className="flex relative">
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          className={`${classInput}`}
        />
        {/* <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value ?? ""} // important : ne pas forcer à "" à chaque render
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          className={`w-full p-2 pl-3 pr-10 border-2 border-primary bg-white rounded-lg text-sm outline-none 
  focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed`}
          autoComplete="off"
        /> */}

        {/* Bouton "effacer" animé */}
        <AnimatePresence>
          {showClear && value && !disabled && (
            <motion.div
              key="close-icon"
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
              transition={{ duration: 0.25 }}
              className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer`}
              onClick={() => onChange("")}
            >
              <FiXCircle
                size={18}
                className="text-primary hover:text-gray-700 transition-colors"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InputField;
