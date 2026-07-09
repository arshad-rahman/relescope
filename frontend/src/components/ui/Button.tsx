import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "w-full rounded-xl bg-blue-600 px-4 py-3 text-white font-semibold transition",
        "hover:bg-blue-700",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
