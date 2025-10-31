# Test-Dokumentation

## Übersicht

Dieses Projekt verwendet **Vitest** als Test-Framework mit **React Testing Library** für Komponententests.

## Test-Setup

### Dependencies
- `vitest` - Test-Framework (schnelle Alternative zu Jest)
- `@testing-library/react` - React-Komponenten testen
- `@testing-library/jest-dom` - Zusätzliche Assertions
- `@testing-library/user-event` - User-Interaktionen simulieren
- `jsdom` / `happy-dom` - DOM-Simulation

### Konfiguration
- **vitest.config.ts** - Vitest-Konfiguration
- **src/test/setup.ts** - Test-Setup und globale Mocks
- **src/test/test-utils.tsx** - Custom Render-Funktion mit Router

## Tests ausführen

```bash
# Alle Tests einmal ausführen
npm run test:run

# Tests im Watch-Mode (automatisches Neu-Ausführen)
npm test

# Tests mit UI
npm run test:ui

# Coverage-Report erstellen
npm run test:coverage
```

## Vorhandene Tests

### Komponenten-Tests
- **Button.test.tsx** (7 Tests)
  - Rendering mit verschiedenen Variants
  - Click-Handler
  - Disabled-State
  - Icon-Rendering

- **Breadcrumbs.test.tsx** (5 Tests)
  - Multiple Items rendern
  - Leere Breadcrumbs
  - Hervorhebung des letzten Items
  - Trennzeichen

### Service-Tests
- **storageService.test.ts** (9 Tests)
  - Case Data speichern/laden
  - Assets verwalten
  - Schulden verwalten
  - Mock-Daten Initialisierung

- **themeService.test.ts** (10 Tests)
  - Theme-Präferenzen
  - Toggle-Funktion
  - Listener-System
  - Dark/Light Mode

## Neue Tests schreiben

### Beispiel: Komponenten-Test

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/test-utils';
import MeineKomponente from './MeineKomponente';

describe('MeineKomponente', () => {
  it('rendert korrekt', () => {
    render(<MeineKomponente />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Beispiel: Service-Test

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { meinService } from './meinService';

describe('MeinService', () => {
  beforeEach(() => {
    // Setup vor jedem Test
    localStorage.clear();
  });

  it('funktioniert korrekt', () => {
    const result = meinService.doSomething();
    expect(result).toBe('expected');
  });
});
```

## Best Practices

1. **AAA-Pattern**: Arrange, Act, Assert
2. **Descriptive Tests**: Test-Namen sollten beschreiben, was getestet wird
3. **Isolation**: Jeder Test sollte unabhängig sein
4. **Cleanup**: `beforeEach` / `afterEach` für sauberen Zustand
5. **Mock Sparingly**: Nur mocken wenn nötig

## GitHub Actions

Die Tests werden automatisch bei jedem Push und Pull Request ausgeführt:
- **CI Pipeline** (`.github/workflows/ci.yml`)
  - Tests auf Node.js 18.x und 20.x
  - Linting
  - Build-Check
  - Coverage-Upload

## Coverage

Coverage-Reports werden nach jedem Test-Lauf im `coverage/` Ordner erstellt:
- **HTML-Report**: `coverage/index.html`
- **JSON-Report**: `coverage/coverage-final.json`

Öffnen Sie `coverage/index.html` im Browser um den detaillierten Coverage-Report zu sehen.

## Troubleshooting

### Tests schlagen fehl
1. Dependencies neu installieren: `npm ci`
2. Cache löschen: `npm run test -- --clearCache`
3. Node-Version prüfen: `node --version` (mindestens v18)

### DOM-bezogene Fehler
- Prüfen Sie ob `jsdom` korrekt konfiguriert ist
- Verwenden Sie `screen.debug()` um DOM-Zustand zu inspizieren

### Async-Tests
- Verwenden Sie `await` bei async Operationen
- `waitFor()` für asynchrone DOM-Updates

## Weitere Ressourcen

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)



