import type { JSX } from "react";

type ButtonProps = {
  onClick: () => void;
  text: string;
  icon?: JSX.Element;
  color: "azul" | "rojo" | "rosa" | "verde" | "ambar";
  iconPosition?: "left" | "right";
};

export const Boton = ({ onClick, text, icon, color, iconPosition = "left" }: ButtonProps) => {

  const colorClasses = {
    azul: "bg-blue-500 hover:bg-blue-600",
    rojo: "bg-red-500 hover:bg-red-600",
    rosa: "bg-pink-500 hover:bg-pink-600",
    verde: "bg-green-500 hover:bg-green-600",
    ambar: "bg-amber-500 hover:bg-amber-600",
  };

  return (
    <button
      onClick={onClick}
      className={`cursor-pointer flex items-center gap-2 text-white font-semibold py-2 px-4 rounded-lg ${colorClasses[color]}`}
    >
      {icon && iconPosition === "left" && icon}
      {text}
      {icon && iconPosition === "right" && icon}
    </button>
  );
};