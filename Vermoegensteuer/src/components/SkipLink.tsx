/**
 * SkipLink-Komponente für Barrierefreiheit (WCAG 2.4.1)
 * Ermöglicht Screenreader-Nutzern und Tastatur-Nutzern das Überspringen der Navigation
 */

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
    >
      {children}
    </a>
  );
}
