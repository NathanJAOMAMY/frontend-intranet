import { FC } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
interface ButtonProps {
  title: string;
  variant: "primary" | "secondary" | "delete";
  onClick: () => void;
  icon?: string;
  type?: "button" | "submit" | "reset";
}

const Button: FC<ButtonProps> = ({ title, variant, onClick, icon, type }) => {
  const baseStyles = "px-4 py-2 rounded text-[1rem] transition flex gap-2 items-center justify-between";

  const classBtn = {
    primary: "bg-primary text-white hover:opacity-90",
    secondary: "border border-primary text-primary hover:bg-primary hover:text-white",
    delete: "bg-[#E11D48] text-white hover:opacity-90",
  }

  return (
    <button
      type={type}
      className={`${classBtn[variant]} ${baseStyles}`}
      onClick={onClick}
    >
      {icon && <Icon icon={icon} />} <span >{title}</span>
    </button>
  );
};

export default Button;
