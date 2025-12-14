import { ExclamationTriangleIcon, CheckCircleIcon, MinusCircleIcon } from '@heroicons/react/24/outline';

interface StatusChipProps {
  variant: 'success' | 'neutral' | 'warning';
  label: string;
  /** Optionale zusätzliche Beschreibung für Screenreader */
  description?: string;
}

/**
 * StatusChip-Komponente mit barrierefreier Darstellung
 * 
 * WCAG-Konformität:
 * - 1.4.1: Farbunabhängige Statusinformation durch Icons
 * - 1.4.3: Kontrastverhältnis mindestens 4.5:1
 * - 4.1.2: Vollständige Statusinformation für assistive Technologien
 */
export default function StatusChip({ variant, label, description }: StatusChipProps) {
  const baseClasses = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1';
  
  const variantClasses = {
    success: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 ring-green-200 dark:ring-green-800',
    neutral: 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 ring-gray-200 dark:ring-gray-600',
    warning: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 ring-amber-200 dark:ring-amber-800',
  };

  // Icon basierend auf Variante für farbunabhängige Statusinformation
  const StatusIcon = {
    success: CheckCircleIcon,
    neutral: MinusCircleIcon,
    warning: ExclamationTriangleIcon,
  }[variant];

  // Statusbeschreibung für Screenreader
  const statusText = {
    success: 'Erfolgreich',
    neutral: 'Neutral',
    warning: 'Warnung',
  }[variant];

  return (
    <span 
      className={`${baseClasses} ${variantClasses[variant]}`}
      role="status"
      aria-label={`${statusText}: ${label}${description ? `. ${description}` : ''}`}
    >
      <StatusIcon 
        className="h-3.5 w-3.5 flex-shrink-0" 
        aria-hidden="true" 
      />
      <span>{label}</span>
    </span>
  );
}
