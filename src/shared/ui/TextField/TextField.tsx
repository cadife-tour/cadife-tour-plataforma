"use client";

import React, { useId } from "react";
import { clsx } from "clsx";

interface BaseFieldProps {
  label: string;
  /** Texto de apoio abaixo do campo. */
  hint?: string;
  /** Mensagem de erro; também marca o campo como inválido. */
  error?: string;
  /** Renderiza um textarea em vez de input. */
  multiline?: boolean;
}

export type TextFieldProps = BaseFieldProps &
  Omit<
    React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "children"
  >;

/**
 * Campo de texto acessível: rótulo ligado ao campo, dica e erro anunciados
 * via `aria-describedby`, estado inválido com `aria-invalid`.
 */
export const TextField: React.FC<TextFieldProps> = ({
  label,
  hint,
  error,
  multiline = false,
  id,
  className,
  required,
  ...props
}) => {
  const autoId = useId();
  const fieldId = id ?? `field-${autoId}`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const fieldClass = clsx(
    "w-full rounded-xl border bg-background px-4 font-sans text-sm text-foreground placeholder:text-foreground-subtle transition-colors duration-200 focus:outline-none focus-visible:border-brand-accent focus-visible:ring-2 focus-visible:ring-brand-primary/30 disabled:cursor-not-allowed disabled:opacity-50",
    error ? "border-brand-accent" : "border-border hover:border-foreground-subtle",
    multiline ? "min-h-[120px] resize-y py-3" : "h-12"
  );

  const shared = {
    id: fieldId,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: fieldClass,
  };

  return (
    <div className={clsx("grid gap-2", className)}>
      <label htmlFor={fieldId} className="font-sans text-sm font-semibold text-foreground">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-brand-accent">
            *
          </span>
        )}
      </label>
      {multiline ? (
        <textarea {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} {...shared} />
      ) : (
        <input {...(props as React.InputHTMLAttributes<HTMLInputElement>)} {...shared} />
      )}
      {hint && (
        <p id={hintId} className="text-xs text-foreground-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs font-semibold text-brand-accent">
          {error}
        </p>
      )}
    </div>
  );
};
