import { ReactNode, useId } from 'react';

interface FormFieldProps {
  /** Label-Text */
  label: string;
  /** Ist das Feld erforderlich? */
  required?: boolean;
  /** Fehlermeldung */
  error?: string;
  /** Hilfetext */
  hint?: string;
  /** Das Formularfeld (Input, Select, Textarea) */
  children: (props: {
    id: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
    'aria-required'?: boolean;
  }) => ReactNode;
  /** Optionale CSS-Klassen */
  className?: string;
}

/**
 * FormField-Komponente für barrierefreie Formulare
 * 
 * WCAG-Konformität:
 * - 1.3.1: Label programmatisch mit Input verknüpft
 * - 3.3.1: Fehler identifiziert und beschrieben
 * - 3.3.2: Labels und Anweisungen
 * - 3.3.3: Korrekturvorschläge
 */
export default function FormField({
  label,
  required = false,
  error,
  hint,
  children,
  className = '',
}: FormFieldProps) {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  // Bestimme aria-describedby basierend auf vorhandenen Beschreibungen
  const describedBy = [
    error ? errorId : null,
    hint ? hintId : null,
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className={className}>
      <label 
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-hidden="true">*</span>
        )}
        {required && <span className="sr-only">(Pflichtfeld)</span>}
      </label>
      
      {children({
        id: fieldId,
        'aria-describedby': describedBy,
        'aria-invalid': !!error,
        'aria-required': required,
      })}

      {hint && !error && (
        <p 
          id={hintId} 
          className="mt-1 text-xs text-gray-500 dark:text-gray-400"
        >
          {hint}
        </p>
      )}

      {error && (
        <p 
          id={errorId} 
          className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
          role="alert"
        >
          <svg 
            className="h-3.5 w-3.5 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
