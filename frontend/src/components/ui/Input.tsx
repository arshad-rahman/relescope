import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  className,
  ...props
}: InputProps) {
  return (
    <input
      className={clsx(
        "w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3",
        "text-white",
        "placeholder:text-slate-500",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
      {...props}
    />
  );
}
