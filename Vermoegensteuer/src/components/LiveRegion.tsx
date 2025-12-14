import { useEffect, useRef, useState } from 'react';

/**
 * LiveRegion-Komponente für dynamische Ankündigungen an Screenreader (WCAG 4.1.3)
 * Nutzt aria-live für Status-Updates und wichtige Benachrichtigungen
 */

interface LiveRegionProps {
  /** Die anzukündigende Nachricht */
  message: string;
  /** Priorität: 'polite' wartet, 'assertive' unterbricht sofort */
  politeness?: 'polite' | 'assertive';
  /** Ob nur Änderungen angekündigt werden sollen */
  atomic?: boolean;
  /** Optional: CSS-Klassen für sichtbare Darstellung */
  className?: string;
  /** Ob die Nachricht visuell versteckt sein soll */
  visuallyHidden?: boolean;
}

export default function LiveRegion({
  message,
  politeness = 'polite',
  atomic = true,
  className = '',
  visuallyHidden = true,
}: LiveRegionProps) {
  const [announcement, setAnnouncement] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // Kleine Verzögerung für bessere Screenreader-Kompatibilität
    if (message) {
      // Kurz leeren und dann wieder setzen für wiederholte Nachrichten
      setAnnouncement('');
      timeoutRef.current = setTimeout(() => {
        setAnnouncement(message);
      }, 100);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message]);

  const baseClasses = visuallyHidden ? 'sr-only' : className;

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      className={baseClasses}
    >
      {announcement}
    </div>
  );
}

