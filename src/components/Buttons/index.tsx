import React from "react";
import type { ButtonProps } from "../../types";

export default function Button({
  className,
  label,
  active,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-full px-4 py-2 bg-[#2575E7] hover:bg-blue-600 text-white
        disabled:cursor-not-allowed disabled:opacity-80 uppercase font-medium ${className}`}
      {...props}
      title={label}
    >
      {children || label}
    </button>
  );
}
