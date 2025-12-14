# Barrierefreiheits-Konformitätserklärung

## WCAG 2.1 AA Konformität

Das Vermögensteuer-Dashboard wurde gemäß den **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA** entwickelt und getestet.

---

## 1. Wahrnehmbarkeit (WCAG Prinzip 1)

### 1.1 Textalternativen ✅
- Alle nicht-textlichen Inhalte (Icons, Statusindikatoren) besitzen aussagekräftige `aria-label` oder werden mit ergänzendem Text kombiniert
- Dekorative Elemente sind korrekt mit `aria-hidden="true"` ausgezeichnet
- Icons werden von beschreibendem Text begleitet

### 1.2 Farb- und Kontrastanforderungen ✅
- Text-Kontrastverhältnis mindestens 4.5:1 für normalen Text, 3:1 für großen Text
- UI-Zustände (aktiv, deaktiviert, Fehler) sind nicht ausschließlich farbcodiert
  - StatusChip zeigt zusätzlich Icons zur Unterscheidung
  - Fokus-Indikatoren verwenden Ring-Styling
- Fokus-Indikatoren haben mindestens 3:1 Kontrast zum Hintergrund
- Dark Mode vollständig unterstützt mit angepassten Kontrasten

### 1.3 Skalierbarkeit ✅
- Zoom bis 200% ohne Funktionsverlust möglich
- Responsive Design mit Reflow-Fähigkeit bei 320px Breite
- Keine horizontale Scroll-Abhängigkeit
- `prefers-reduced-motion` wird respektiert

---

## 2. Bedienbarkeit (WCAG Prinzip 2)

### 2.1 Tastaturbedienung ✅
- Sämtliche Funktionen sind vollständig per Tastatur nutzbar
- Logische und konsistente Tab-Reihenfolge
- Keine Keyboard-Fallen (trap focus) in Dialogen - Escape schließt alle Dialoge
- Skip-Links vorhanden ("Zum Hauptinhalt springen", "Zur Navigation springen")

### 2.2 Fokus-Management ✅
- Sichtbarer Fokus-Indikator für jedes interaktive Element (Ring-Styling)
- Fokus wird bei Modals/Dialogen korrekt gesetzt und zurückgegeben
- Dynamisch geladene Inhalte werden via `aria-live` angekündigt
- Fokus wird bei Seitenwechsel auf Hauptinhalt gesetzt

### 2.3 Zeitbegrenzungen ✅
- Keine automatischen Timeouts oder Session-Ablauf
- Fortschrittsanzeigen bei längeren Aktionen (Berechnungen)
- Loading-States werden visuell und für Screenreader angezeigt

---

## 3. Verständlichkeit (WCAG Prinzip 3)

### 3.1 Sprache & Lesbarkeit ✅
- `lang="de"` Attribut korrekt in HTML-Root gesetzt
- Fachbegriffe (z.B. BewG-Paragraphen) werden konsistent verwendet
- Klare, eindeutige Beschriftungen in allen Formularen
- Abkürzungen (z.B. ISIN, WKN) werden mit `<abbr>` ausgezeichnet

### 3.2 Fehlermeldungen & Validierung ✅
- Fehler werden textlich beschrieben, nicht nur visuell markiert
- Fehlerhinweise sind programmatisch mit Feldern verknüpft (`aria-describedby`)
- Korrekturvorschläge und Hinweise werden angezeigt
- Formulare verwenden `aria-invalid` bei Fehlern

---

## 4. Robustheit (WCAG Prinzip 4)

### 4.1 Semantische Struktur ✅
- Korrekte Nutzung von HTML5-Semantik:
  - `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- Überschriftenhierarchie ohne Sprünge (h1 → h2 → h3)
- Tabellen korrekt mit `<th>`, `scope`, `<caption>`
- Listen semantisch mit `<ul>`/`<ol>` und `<li>`

### 4.2 ARIA-Implementierung ✅
- ARIA nur ergänzend, niemals als Ersatz für native Semantik
- Korrekte Rollen: `role="dialog"`, `role="navigation"`, `role="status"`
- Zustände aktuell gehalten: `aria-expanded`, `aria-selected`, `aria-current`
- Live-Regionen für dynamische Inhalte: `aria-live="polite"`

---

## 5. Dashboard-spezifische Anforderungen

### Widget-Fokussierung ✅
- Widgets sind einzeln fokussierbar
- Tab-Panels sind mit Tab-Taste erreichbar
- Übersichtliche Fokus-Reihenfolge

### Filter und Sortierungen ✅
- Such- und Filterfunktionen sind vollständig per Tastatur bedienbar
- Ergebnisse werden für Screenreader angekündigt

### Live-Datenänderungen ✅
- Berechnungsergebnisse nutzen `aria-live="polite"`
- Statusmeldungen (Speichern, Löschen) werden angekündigt
- Keine störenden automatischen Updates

---

## 6. Testing & Qualitätssicherung

### Automatisierte Tests ✅
- Integrierte Accessibility-Tests mit Vitest
- Komponenten-Tests für ARIA-Attribute
- Prüfung von Fokus-Management

### Manuelle Tests ✅
Empfohlene Testmethoden:

| Testmethode | Beschreibung |
|-------------|--------------|
| **Tastatur-Only** | Navigation ohne Maus testen |
| **Screen Reader** | NVDA, JAWS, VoiceOver |
| **Zoom 200%** | Funktionsprüfung bei Vergrößerung |
| **High Contrast** | Windows-Kontrastmodus |
| **Reduced Motion** | Animationen deaktiviert |

### Tools für Entwickler

```bash
# Automatisierte Tests ausführen
npm run test

# Barrierefreiheits-Tests spezifisch
npm run test -- a11y

# Browser-Extensions empfohlen:
# - axe DevTools
# - WAVE
# - Lighthouse
```

---

## 7. Bekannte Einschränkungen

- Drag-&-Drop Funktionalität ist nicht implementiert (keine Tastatur-Alternative erforderlich)
- Diagramme/Charts sind derzeit nicht enthalten

---

## 8. Kontakt

Bei Fragen zur Barrierefreiheit oder Problemen mit der Nutzung der Anwendung wenden Sie sich bitte an den technischen Support.

---

## 9. Letzte Aktualisierung

Diese Konformitätserklärung wurde zuletzt aktualisiert am: **Dezember 2024**

---

## Anhang: WCAG 2.1 AA Checkliste

| Kriterium | Status |
|-----------|--------|
| 1.1.1 Non-text Content | ✅ |
| 1.3.1 Info and Relationships | ✅ |
| 1.3.2 Meaningful Sequence | ✅ |
| 1.3.3 Sensory Characteristics | ✅ |
| 1.4.1 Use of Color | ✅ |
| 1.4.3 Contrast (Minimum) | ✅ |
| 1.4.4 Resize Text | ✅ |
| 1.4.10 Reflow | ✅ |
| 1.4.11 Non-text Contrast | ✅ |
| 1.4.13 Content on Hover or Focus | ✅ |
| 2.1.1 Keyboard | ✅ |
| 2.1.2 No Keyboard Trap | ✅ |
| 2.4.1 Bypass Blocks | ✅ |
| 2.4.2 Page Titled | ✅ |
| 2.4.3 Focus Order | ✅ |
| 2.4.4 Link Purpose | ✅ |
| 2.4.6 Headings and Labels | ✅ |
| 2.4.7 Focus Visible | ✅ |
| 3.1.1 Language of Page | ✅ |
| 3.2.1 On Focus | ✅ |
| 3.2.2 On Input | ✅ |
| 3.3.1 Error Identification | ✅ |
| 3.3.2 Labels or Instructions | ✅ |
| 3.3.3 Error Suggestion | ✅ |
| 4.1.1 Parsing | ✅ |
| 4.1.2 Name, Role, Value | ✅ |
| 4.1.3 Status Messages | ✅ |
