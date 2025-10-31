import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/test-utils';
import Breadcrumbs from './Breadcrumbs';

describe('Breadcrumbs Component', () => {
  it('rendert alle Breadcrumb-Items', () => {
    const items = ['Home', 'Bereich', 'Seite'];
    render(<Breadcrumbs items={items} />);

    items.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('rendert leere Breadcrumbs ohne Fehler', () => {
    render(<Breadcrumbs items={[]} />);
    const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();
  });

  it('hebt das letzte Item hervor', () => {
    const items = ['Home', 'Bereich', 'Aktuelle Seite'];
    render(<Breadcrumbs items={items} />);

    const lastItem = screen.getByText('Aktuelle Seite');
    expect(lastItem).toHaveClass('font-medium');
  });

  it('rendert Trennzeichen zwischen Items', () => {
    const items = ['Home', 'Bereich', 'Seite'];
    const { container } = render(<Breadcrumbs items={items} />);

    // ChevronRightIcon sollte als SVG gerendert werden
    const chevrons = container.querySelectorAll('svg');
    // Es sollten 2 Chevrons sein (zwischen 3 Items)
    expect(chevrons.length).toBe(2);
  });

  it('zeigt nur ein Item wenn nur eins vorhanden', () => {
    render(<Breadcrumbs items={['Einzige Seite']} />);
    
    expect(screen.getByText('Einzige Seite')).toBeInTheDocument();
    // Keine Chevrons, da nur ein Item
    const { container } = render(<Breadcrumbs items={['Einzige Seite']} />);
    const chevrons = container.querySelectorAll('svg');
    expect(chevrons.length).toBe(0);
  });
});


