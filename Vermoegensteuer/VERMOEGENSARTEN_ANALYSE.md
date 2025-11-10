# Fachliche Analyse: Vermögensarten und ihre Kennziffern

## Übersicht der Vermögensarten

### 1. Börsennotierte Wertpapiere
**Kennziffern/Eigenschaften:**
- ✅ **ISIN** (International Securities Identification Number) - Standard
- ✅ **WKN** (Wertpapierkennnummer) - Deutschland-spezifisch
- Bezeichnung (z.B. Firmenname)
- Stückzahl/Menge
- Einheitswert (Börsenkurs)
- Positionswert (berechnet)
- Kursdatum
- Quelle (Börse, z.B. Xetra, NASDAQ)
- Bewertungsmethode: § 11 BewG

**Beispiele:** Aktien, börsennotierte Anleihen, börsennotierte ETFs

---

### 2. Nicht börsennotierte Investmentanteile
**Kennziffern/Eigenschaften:**
- ✅ **ISIN** (Investmentfonds haben immer eine ISIN, auch wenn nicht börsennotiert)
- Bezeichnung (Fondsname)
- Stückzahl/Menge (Anteile)
- Einheitswert (Rücknahmepreis)
- Positionswert (berechnet)
- Kursdatum
- Quelle (Fondsgesellschaft, z.B. DWS, Bloomberg)
- Bewertungsmethode: § 9 BewG (gemeiner Wert)

**Beispiele:** Investmentfonds, nicht börsennotierte ETFs, geschlossene Fonds

---

### 3. Kapitalforderungen
**Kennziffern/Eigenschaften:**
- ❌ **KEINE ISIN/WKN** (Bankguthaben haben keine Wertpapierkennnummern)
- ✅ **Kontonummer** oder **IBAN** (International Bank Account Number)
- ✅ **Vertragsnummer** (bei Festgeld, Sparverträgen)
- Bezeichnung (z.B. "Tagesgeldkonto Sparkasse München")
- Menge: typischerweise 1 (ein Konto/eine Forderung)
- Einheitswert = Nennwert
- Positionswert = Nennwert
- Kursdatum (Stichtag)
- Quelle (Kontoauszug, Vertrag)
- Bewertungsmethode: § 12 BewG

**Beispiele:** 
- Bankguthaben (Tagesgeld, Festgeld, Sparbuch)
- Forderungen gegenüber Dritten
- Guthaben bei Finanzdienstleistern

---

### 4. Sonstige Finanzinstrumente
**Kennziffern/Eigenschaften:**
- ❌ **KEINE ISIN/WKN** (Kryptowährungen und andere exotische Instrumente haben keine Wertpapierkennnummern)
- ✅ **Optional: Wallet-Adresse** (bei Kryptowährungen)
- ✅ **Optional: Ticker-Symbol** (z.B. BTC, ETH)
- Bezeichnung (z.B. "Bitcoin (BTC)", "Ethereum (ETH)")
- Menge (z.B. 0.5 BTC)
- Einheitswert (Marktpreis)
- Positionswert (berechnet)
- Kursdatum
- Quelle (Börse, z.B. Coinbase, Binance)
- Bewertungsmethode: § 9 BewG (gemeiner Wert)

**Beispiele:** 
- Kryptowährungen (Bitcoin, Ethereum, etc.)
- Derivate
- Exotische Finanzinstrumente

---

## Zusammenfassung

| Vermögensart | ISIN/WKN | Alternative Kennziffern |
|--------------|----------|-------------------------|
| Börsennotierte Wertpapiere | ✅ Ja | - |
| Nicht börsennotierte Investmentanteile | ✅ Ja (ISIN) | - |
| Kapitalforderungen | ❌ Nein | Kontonummer, IBAN, Vertragsnummer |
| Sonstige Finanzinstrumente | ❌ Nein | Optional: Wallet-Adresse, Ticker-Symbol |

## Code-Anpassungen erforderlich

1. **AssetDialog**: Identifikator-Feld sollte je nach Kategorie unterschiedlich beschriftet werden:
   - "ISIN/WKN" für börsennotierte Wertpapiere und Investmentanteile
   - "Kontonummer/IBAN" für Kapitalforderungen
   - "Identifikator (optional)" für Sonstige Finanzinstrumente

2. **Validierung**: ISIN/WKN sollte nur bei relevanten Kategorien als Pflichtfeld behandelt werden.

3. **Löschbutton**: Sollte im Dialog verfügbar sein, wenn ein Asset bearbeitet wird (nicht beim Erstellen).
