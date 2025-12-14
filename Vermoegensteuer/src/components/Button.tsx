import { ReactNode, forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  /** Beschreibender Text für Screenreader */
  'aria-label'?: string;
  /** ID des beschreibenden Elements */
  'aria-describedby'?: string;
  /** Ladezustand */
  loading?: boolean;
}

/**
 * Button-Komponente mit vollständiger Barrierefreiheit
 * 
 * WCAG-Konformität:
 * - 1.4.3: Mindestkontrast 4.5:1
 * - 2.1.1: Vollständig per Tastatur bedienbar
 * - 2.4.7: Sichtbarer Fokus-Indikator
 * - 4.1.2: Name, Rolle, Wert für assistive Technologien
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  loading = false,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}, ref) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 
    rounded-md px-3 py-2 text-sm font-medium 
    transition-colors 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    dark:focus:ring-offset-gray-900 
    disabled:opacity-50 disabled:cursor-not-allowed
  `.replace(/\s+/g, ' ').trim();
  
  const variantClasses = {
    primary: `
      bg-blue-600 dark:bg-blue-600 
      text-white 
      shadow-sm 
      hover:bg-blue-700 dark:hover:bg-blue-700 
      focus:ring-blue-600
    `.replace(/\s+/g, ' ').trim(),
    secondary: `
      border border-gray-300 dark:border-gray-600 
      bg-white dark:bg-gray-800 
      text-gray-700 dark:text-gray-300 
      hover:bg-gray-50 dark:hover:bg-gray-700 
      focus:ring-blue-600
    `.replace(/\s+/g, ' ').trim(),
    danger: `
      bg-red-600 dark:bg-red-600 
      text-white 
      shadow-sm 
      hover:bg-red-700 dark:hover:bg-red-700 
      focus:ring-red-600
    `.replace(/\s+/g, ' ').trim(),
  };

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      aria-disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
