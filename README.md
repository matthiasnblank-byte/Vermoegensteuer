# B2B Dashboard

Schlanke B2B-Dashboard-Oberfl?che f?r Stammdaten-Erfassung und Finanzanlagen-Verwaltung.

## Tech Stack

- **React 18** mit **TypeScript**
- **Tailwind CSS** f?r Styling
- **Headless UI** f?r UI-Primitives (Tabs, Dialog, etc.)
- **Heroicons** f?r Icons
- **React Router** f?r Navigation
- **Vite** als Build-Tool

## Setup

### Voraussetzungen

- Node.js (Version 18 oder h?her)
- npm oder yarn

### Installation

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Production Build erstellen
npm run build
```

Die Anwendung l?uft standardm??ig auf `http://localhost:5173`.

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

- Sidebar-Navigation mit Badge-Z?hlern
- Header mit Breadcrumbs und Aktionskarten
- Tab-Navigation mit Headless UI
- Suchfunktion und Filter
- Datentabelle mit Zeilenauswahl

### Stammdaten-Seite

- Erfassung aller stichtags- und personenbezogenen Grunddaten
- Veranlagungsparameter (Bewertungsstichtag, W?hrung)
- Erkl?rungs- und Nachweisangaben
- Kommunikationsdaten
- Persistenz ?ber Local Storage

### Finanzanlagen-Seite

- Kategorien:
  - B?rsennotierte Wertpapiere
  - Fonds / Investmentanteile
  - Bankguthaben & Forderungen
  - Sonstige / Krypto
  - Schulden
- Tab-Navigation f?r Kategorien
- Positions?bersicht mit Bewertungsinformationen
- Summenspiegel (Verm?gen brutto/netto, Schulden)

## Design-Tokens

- **Schrift**: Inter (Fallback: system-ui)
- **Farben**: 
  - Neutral: gray-50/100/200/300/500/700/900
  - Primary: blue-600
  - Success: green-600
  - Warning: amber-600
- **Abst?nde**: 4/8/12/16-Skala
- **Radii**: rounded-md, rounded-lg
- **Schatten**: shadow-sm, shadow-md

## Datenpersistenz

Alle Daten werden im **Local Storage** des Browsers gespeichert. Beim ersten Start werden Mock-Daten initialisiert.

## Zug?nglichkeit (A11y)

- ARIA-Labels und Rollen f?r alle interaktiven Elemente
- Sichtbare Fokus-Indikatoren (focus:ring-2)
- Keyboard-Navigation unterst?tzt
- Ausreichender Kontrast (WCAG AA)

## Hinweise

- **Nur Frontend**: Keine Backend-Anbindung, alle Daten werden lokal gespeichert
- **Mock-Daten**: Beim ersten Start werden Beispiel-Daten geladen
- **Keine Business-Logik**: Fokus liegt ausschlie?lich auf UI/UX
