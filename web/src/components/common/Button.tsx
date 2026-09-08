"use client";

import { ButtonHTMLAttributes } from "react";
import clsx from "@/lib/clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<string, string> = {
  primary: "bg-primary text-white shadow-subtle hover:bg-primary-dark",
  secondary: "bg-surfaceLight text-text hover:bg-border",
  danger: "bg-danger text-white shadow-subtle hover:opacity-90",
  ghost: "bg-transparent text-primary border-1.5 border-primary hover:bg-primary-light",
};

export function Button({
  variant = "primary",
  loading,
  disabled,
  fullWidth,
  className,
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      disabled={isDisabled}
      className={clsx(
        "inline-flex items-center justify-center rounded-md px-lg py-md text-bodyBold font-semibold transition-opacity",
        variantClasses[variant],
        variant === "ghost" && "border border-primary",
        isDisabled ? "opacity-50 cursor-not-allowed" : "active:opacity-80",
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        children
      )}
    </button>
  );
}
