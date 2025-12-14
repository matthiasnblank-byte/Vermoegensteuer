import { ReactNode } from 'react';

/**
 * VisuallyHidden-Komponente (WCAG 1.3.1)
 * Versteckt Inhalte visuell, macht sie aber für Screenreader zugänglich
 */

interface VisuallyHiddenProps {
  children: ReactNode;
  /** Optionales HTML-Element (Standard: span) */
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export default function VisuallyHidden({ 
  children, 
  as: Component = 'span' 
}: VisuallyHiddenProps) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
}
