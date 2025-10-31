/**
 * Validierungs-Hilfsfunktionen mit vollst?ndiger Unicode-Unterst?tzung
 * f?r deutsche Umlaute (?, ?, ?, ?, ?, ?, ?) und andere diakritische Zeichen
 */

/**
 * Regex-Pattern f?r Text-Eingaben, die Umlaute erlauben
 * Erlaubt: Buchstaben (alle Skripte), Ziffern, Leerzeichen, Bindestriche, Punkte, Kommas, Apostroph, Klammern, Schr?gstriche
 */
export const TEXT_PATTERN = /^[\p{L}\p{N}\p{Zs}\-.,'()\/]+$/u;

/**
 * Regex-Pattern f?r Namen (strenger)
 * Erlaubt: Buchstaben, Leerzeichen, Bindestriche, Apostroph
 */
export const NAME_PATTERN = /^[\p{L}\p{Zs}\-']+$/u;

/**
 * Normalisiert einen String zu NFC (Canonical Composition)
 * Dies stellt sicher, dass zusammengesetzte Zeichen (z.B. ? = a + ?) als ein Zeichen behandelt werden
 */
export function normalizeString(str: string): string {
  return str.normalize('NFC');
}

/**
 * Validiert einen Text-String (unterst?tzt Umlaute)
 */
export function validateText(text: string): boolean {
  if (!text || text.trim().length === 0) return false;
  return TEXT_PATTERN.test(normalizeString(text));
}

/**
 * Validiert einen Namen (unterst?tzt Umlaute)
 */
export function validateName(name: string): boolean {
  if (!name || name.trim().length === 0) return false;
  return NAME_PATTERN.test(normalizeString(name));
}

/**
 * Bereinigt einen String f?r die Speicherung (normalisiert zu NFC)
 */
export function sanitizeForStorage(text: string): string {
  return normalizeString(text.trim());
}

/**
 * Beispiel-Testdaten mit Umlauten
 */
export const UMLAUT_TEST_DATA = [
  'M?ller',
  'J?rg',
  'Gr??e',
  'Schr?der',
  'Fu?',
  '?rztin',
  '?konom',
  '?berweisung',
  'M?ller & Schr?der GmbH',
  'J?rg M?ller ? ?berweisung',
] as const;
