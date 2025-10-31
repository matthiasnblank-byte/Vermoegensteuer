import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface StatusChipProps {
  variant: 'success' | 'neutral' | 'warning';
  label: string;
}

export default function StatusChip({ variant, label }: StatusChipProps) {
  const baseClasses = 'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1';
  
  const variantClasses = {
    success: 'bg-green-50 text-green-700 ring-green-200',
    neutral: 'bg-gray-50 text-gray-700 ring-gray-200',
    warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {variant === 'warning' && (
        <ExclamationTriangleIcon className="h-3 w-3" aria-hidden="true" />
      )}
      {label}
    </span>
  );
}
