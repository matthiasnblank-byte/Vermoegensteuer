/**
 * Validierungs-Hilfsfunktionen mit vollständiger Unicode-Unterstützung
 * für deutsche Umlaute (?, ?, ?, ?, ?, ?, ?) und andere diakritische Zeichen
 */

/**
 * Regex-Pattern für Text-Eingaben, die Umlaute erlauben
 * Erlaubt: Buchstaben (alle Skripte), Ziffern, Leerzeichen, Bindestriche, Punkte, Kommas, Apostroph, Klammern, Schrägstriche
 */
export const TEXT_PATTERN = /^[\p{L}\p{N}\p{Zs}\-.,'()\/]+$/u;

/**
 * Regex-Pattern für Namen (strenger)
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
 * Validiert einen Text-String (unterstützt Umlaute)
 */
export function validateText(text: string): boolean {
  if (!text || text.trim().length === 0) return false;
  return TEXT_PATTERN.test(normalizeString(text));
}

/**
 * Validiert einen Namen (unterstützt Umlaute)
 */
export function validateName(name: string): boolean {
  if (!name || name.trim().length === 0) return false;
  return NAME_PATTERN.test(normalizeString(name));
}

/**
 * Bereinigt einen String für die Speicherung (normalisiert zu NFC)
 */
export function sanitizeForStorage(text: string): string {
  return normalizeString(text.trim());
}

/**
 * Beispiel-Testdaten mit Umlauten
 */
export const UMLAUT_TEST_DATA = [
  'Müller',
  'Jörg',
  'Größe',
  'Schröder',
  'Fuß',
  'Ärztin',
  'Ökonom',
  'Überweisung',
  'Müller & Schröder GmbH',
  'Jörg Müller – Überweisung',
] as const;
