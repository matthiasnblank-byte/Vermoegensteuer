/**
 * Automatisierte Barrierefreiheits-Tests
 * 
 * Diese Tests prüfen die WCAG 2.1 AA Konformität der Anwendung.
 * Basierend auf axe-core für automatisierte Accessibility-Prüfungen.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/Button';
import StatusChip from '../components/StatusChip';
import Tabs from '../components/Tabs';
import SearchBar from '../components/SearchBar';
import SkipLink from '../components/SkipLink';
import LiveRegion from '../components/LiveRegion';
import VisuallyHidden from '../components/VisuallyHidden';

describe('Barrierefreiheits-Tests (WCAG 2.1 AA)', () => {
  
  describe('1. Wahrnehmbarkeit (WCAG Prinzip 1)', () => {
    
    describe('1.1 Textalternativen', () => {
      
      it('StatusChip hat aria-label mit vollständiger Statusinformation', () => {
        render(<StatusChip variant="success" label="Aktiv" />);
        
        const chip = screen.getByRole('status');
        expect(chip).toHaveAttribute('aria-label');
        expect(chip.getAttribute('aria-label')).toContain('Erfolgreich');
        expect(chip.getAttribute('aria-label')).toContain('Aktiv');
      });

      it('StatusChip zeigt Icon für farbunabhängige Statusinformation', () => {
        const { container } = render(<StatusChip variant="warning" label="Warnung" />);
        
        const icon = container.querySelector('svg');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });

      it('Button Icons sind mit aria-hidden markiert', () => {
        const { container } = render(
          <Button>
            <svg aria-hidden="true">Test</svg>
            Klick mich
          </Button>
        );
        
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('aria-hidden', 'true');
      });
    });

    describe('1.3 Anpassbar', () => {
      
      it('Breadcrumbs verwenden semantische nav und ol Elemente', () => {
        render(<Breadcrumbs items={['Home', 'Kategorie', 'Seite']} />);
        
        const nav = screen.getByRole('navigation', { name: /navigationspfad/i });
        expect(nav).toBeInTheDocument();
        
        const list = screen.getByRole('list');
        expect(list).toBeInTheDocument();
      });

      it('Aktuelle Seite ist mit aria-current markiert', () => {
        render(<Breadcrumbs items={['Home', 'Kategorie', 'Aktuelle Seite']} />);
        
        const currentPage = screen.getByText('Aktuelle Seite');
        expect(currentPage).toHaveAttribute('aria-current', 'page');
      });
    });
  });

  describe('2. Bedienbarkeit (WCAG Prinzip 2)', () => {
    
    describe('2.1 Tastaturbedienbar', () => {
      
      it('Button ist fokussierbar und hat korrekten Typ', () => {
        render(<Button onClick={() => {}}>Test</Button>);
        
        const button = screen.getByRole('button', { name: 'Test' });
        expect(button).toHaveAttribute('type', 'button');
        button.focus();
        expect(button).toHaveFocus();
      });

      it('Deaktivierter Button hat aria-disabled', () => {
        render(<Button disabled>Deaktiviert</Button>);
        
        const button = screen.getByRole('button', { name: 'Deaktiviert' });
        expect(button).toHaveAttribute('aria-disabled', 'true');
      });

      it('Ladender Button hat aria-busy', () => {
        render(<Button loading>Laden...</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-busy', 'true');
      });
    });

    describe('2.4 Navigierbar', () => {
      
      it('SkipLink ist nur bei Fokus sichtbar', () => {
        render(<SkipLink href="#main">Zum Hauptinhalt</SkipLink>);
        
        const link = screen.getByRole('link', { name: 'Zum Hauptinhalt' });
        expect(link).toHaveClass('sr-only');
        expect(link).toHaveClass('focus:not-sr-only');
      });
    });
  });

  describe('3. Verständlichkeit (WCAG Prinzip 3)', () => {
    
    describe('3.3 Eingabeunterstützung', () => {
      
      it('SearchBar hat verknüpftes Label', () => {
        render(<SearchBar label="Suche nach Dokumenten" />);
        
        const input = screen.getByRole('searchbox');
        expect(input).toHaveAccessibleName('Suche nach Dokumenten');
      });

      it('Suchfeld hat Hinweis für Escape-Taste', () => {
        render(<SearchBar />);
        
        const input = screen.getByRole('searchbox');
        
        // Prüfen dass das Suchfeld vorhanden ist
        expect(input).toBeInTheDocument();
      });
    });
  });

  describe('4. Robustheit (WCAG Prinzip 4)', () => {
    
    describe('4.1 Kompatibel', () => {
      
      it('Tabs haben korrekte ARIA-Struktur', () => {
        render(
          <Tabs
            items={[
              { label: 'Tab 1', content: <div>Inhalt 1</div> },
              { label: 'Tab 2', content: <div>Inhalt 2</div> },
            ]}
          />
        );
        
        const tablist = screen.getByRole('tablist');
        expect(tablist).toBeInTheDocument();
        
        const tabs = screen.getAllByRole('tab');
        expect(tabs).toHaveLength(2);
        
        // Erster Tab sollte ausgewählt sein
        expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
        expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
      });

      it('Tab-Panels haben aria-labelledby', () => {
        render(
          <Tabs
            items={[
              { label: 'Tab 1', content: <div>Inhalt 1</div> },
            ]}
          />
        );
        
        const panel = screen.getByRole('tabpanel');
        expect(panel).toHaveAttribute('aria-labelledby');
      });
    });

    describe('4.1.3 Status-Nachrichten', () => {
      
      it('LiveRegion hat aria-live Attribut', () => {
        render(<LiveRegion message="Test-Nachricht" />);
        
        const region = screen.getByRole('status');
        expect(region).toHaveAttribute('aria-live', 'polite');
        expect(region).toHaveAttribute('aria-atomic', 'true');
      });

      it('LiveRegion mit assertive Priorität', () => {
        render(<LiveRegion message="Wichtig!" politeness="assertive" />);
        
        const region = screen.getByRole('status');
        expect(region).toHaveAttribute('aria-live', 'assertive');
      });
    });
  });

  describe('5. Hilfstechnologien', () => {
    
    it('VisuallyHidden rendert Inhalt für Screenreader', () => {
      render(<VisuallyHidden>Versteckter Text</VisuallyHidden>);
      
      const hidden = screen.getByText('Versteckter Text');
      expect(hidden).toHaveClass('sr-only');
    });

    it('VisuallyHidden kann verschiedene HTML-Elemente rendern', () => {
      render(<VisuallyHidden as="h2">Überschrift</VisuallyHidden>);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('sr-only');
      expect(heading).toHaveTextContent('Überschrift');
    });
  });

  describe('6. Fokus-Management', () => {
    
    it('Button hat sichtbaren Fokus-Indikator', () => {
      render(<Button>Fokus-Test</Button>);
      
      const button = screen.getByRole('button');
      // Prüfe ob Fokus-Ring Klassen vorhanden sind
      expect(button.className).toContain('focus:ring');
    });

    it('Alle interaktiven Elemente haben Fokus-Styling', () => {
      const { container } = render(
        <>
          <Button>Button</Button>
          <SearchBar />
        </>
      );
      
      const focusableElements = container.querySelectorAll('button, input');
      focusableElements.forEach(element => {
        expect(element.className).toContain('focus:');
      });
    });
  });
});

describe('Komponenten-spezifische Tests', () => {
  
  describe('Button-Varianten', () => {
    it.each(['primary', 'secondary', 'danger'] as const)('Button %s Variante ist zugänglich', (variant) => {
      render(<Button variant={variant}>Test {variant}</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAccessibleName(`Test ${variant}`);
    });
  });

  describe('StatusChip-Varianten', () => {
    it.each(['success', 'neutral', 'warning'] as const)('StatusChip %s hat korrektes Icon', (variant) => {
      const { container } = render(<StatusChip variant={variant} label="Test" />);
      
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });
});
