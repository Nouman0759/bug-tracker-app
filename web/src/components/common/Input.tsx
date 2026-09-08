"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import clsx from "@/lib/clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...rest }: InputProps) {
  return (
    <div className="mb-md">
      {label ? <label className="mb-xs block text-caption text-text-muted">{label}</label> : null}
      <input
        className={clsx(
          "w-full rounded-md border bg-surface px-md py-md text-body text-text outline-none focus:border-primary",
          error ? "border-danger" : "border-border",
          className
        )}
        {...rest}
      />
      {error ? <p className="mt-xs text-small text-danger">{error}</p> : null}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, ...rest }: TextareaProps) {
  return (
    <div className="mb-md">
      {label ? <label className="mb-xs block text-caption text-text-muted">{label}</label> : null}
      <textarea
        className={clsx(
          "w-full rounded-md border bg-surface px-md py-md text-body text-text outline-none focus:border-primary",
          error ? "border-danger" : "border-border",
          className
        )}
        {...rest}
      />
      {error ? <p className="mt-xs text-small text-danger">{error}</p> : null}
    </div>
  );
}
