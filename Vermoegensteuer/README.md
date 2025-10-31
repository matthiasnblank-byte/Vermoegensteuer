# B2B Dashboard

Schlanke B2B-Dashboard-Oberfläche für Stammdaten-Erfassung und Finanzanlagen-Verwaltung.

## Tech Stack

- **React 18** mit **TypeScript**
- **Tailwind CSS** für Styling
- **Headless UI** für UI-Primitives (Tabs, Dialog, etc.)
- **Heroicons** für Icons
- **React Router** für Navigation
- **Vite** als Build-Tool

## Setup

### Voraussetzungen

- Node.js (Version 18 oder höher)
- npm oder yarn

### Installation

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Tests ausführen
npm test

# Production Build erstellen
npm run build
```

Die Anwendung läuft standardmäßig auf `http://localhost:5173`.

## Projektstruktur

```
src/
??? components/          # Wiederverwendbare UI-Komponenten
?   ??? AppShell.tsx     # Haupt-Layout mit Sidebar und Header
?   ??? SidebarNav.tsx   # Navigation in der Sidebar
?   ??? Breadcrumbs.tsx  # Breadcrumb-Navigation
?   ??? HeaderCards.tsx  # Karten im Header
?   ??? Tabs.tsx         # Tab-Komponente (Headless UI)
?   ??? SearchBar.tsx    # Suchfeld mit optionalem Datum-Filter
?   ??? DataTable.tsx    # Datentabelle mit Auswahl
?   ??? StatusChip.tsx   # Status-Badges
?   ??? Button.tsx       # Button-Komponenten
??? pages/               # Seiten-Komponenten
?   ??? DashboardPage.tsx      # Dashboard-?bersicht
?   ??? StammdatenPage.tsx     # Stammdaten-Erfassung
?   ??? FinanzanlagenPage.tsx  # Finanzanlagen-Verwaltung
??? services/            # Services
?   ??? storageService.ts      # Local Storage Service
??? App.tsx              # Haupt-App-Komponente mit Routing
??? main.tsx             # Entry Point
```

## Features

### Dashboard

- Sidebar-Navigation mit Badge-Zählern
- Header mit Breadcrumbs und Aktionskarten
- Tab-Navigation mit Headless UI
- Suchfunktion und Filter
- Datentabelle mit Zeilenauswahl

### Stammdaten-Seite

- Erfassung aller stichtags- und personenbezogenen Grunddaten
- Veranlagungsparameter (Bewertungsstichtag, Währung)
- Erklärungs- und Nachweisangaben
- Kommunikationsdaten
- Persistenz über Local Storage

### Finanzanlagen-Seite

- Kategorien:
  - Börsennotierte Wertpapiere
  - Fonds / Investmentanteile
  - Bankguthaben & Forderungen
  - Sonstige / Krypto
  - Schulden
- Tab-Navigation für Kategorien
- Positionsübersicht mit Bewertungsinformationen
- Summenspiegel (Vermögen brutto/netto, Schulden)

## Design-Tokens

- **Schrift**: Inter (Fallback: system-ui)
- **Farben**: 
  - Neutral: gray-50/100/200/300/500/700/900
  - Primary: blue-600
  - Success: green-600
  - Warning: amber-600
- **Abstände**: 4/8/12/16-Skala
- **Radii**: rounded-md, rounded-lg
- **Schatten**: shadow-sm, shadow-md

## Datenpersistenz

Alle Daten werden im **Local Storage** des Browsers gespeichert. Beim ersten Start werden Mock-Daten initialisiert.

## Zugänglichkeit (A11y)

- ARIA-Labels und Rollen für alle interaktiven Elemente
- Sichtbare Fokus-Indikatoren (focus:ring-2)
- Keyboard-Navigation unterstützt
- Ausreichender Kontrast (WCAG AA)

## Testing

Das Projekt verwendet **Vitest** und **React Testing Library** für automatisierte Tests.

```bash
# Tests ausführen (Watch-Mode)
npm test

# Alle Tests einmal ausführen
npm run test:run

# Tests mit UI
npm run test:ui

# Coverage-Report erstellen
npm run test:coverage
```

**Aktuelle Test-Coverage:**
- 31 Tests in 4 Test-Suites
- Komponenten: Button, Breadcrumbs
- Services: storageService, themeService

Siehe [TEST_README.md](./TEST_README.md) für detaillierte Test-Dokumentation.

## CI/CD

GitHub Actions Pipeline läuft automatisch bei jedem Push:
- ✅ Linting (ESLint)
- ✅ Tests (Node 18.x & 20.x)
- ✅ Build-Check
- ✅ Coverage-Upload

Pipeline-Konfiguration: `.github/workflows/ci.yml`

## Hinweise

- **Nur Frontend**: Keine Backend-Anbindung, alle Daten werden lokal gespeichert
- **Mock-Daten**: Beim ersten Start werden Beispiel-Daten geladen
- **Keine Business-Logik**: Fokus liegt ausschließlich auf UI/UX
- **Vollständig getestet**: Automatisierte Tests für alle Kernfunktionen
