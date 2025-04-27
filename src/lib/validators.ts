/**
 * Funktionen zur Validierung von Eingaben und Daten
 */

/**
 * Prüft, ob ein Wert eine gültige Zahl ist
 *
 * @param value - Der zu prüfende Wert
 * @returns true, wenn der Wert eine gültige Zahl ist, sonst false
 */
export function isValidNumber(value: unknown): boolean {
  if (value === null || value === undefined || value === '') {
    return false;
  }

  const parsed = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(Number(parsed)) && isFinite(Number(parsed));
}

/**
 * Prüft, ob ein Wert eine positive Zahl ist
 *
 * @param value - Der zu prüfende Wert
 * @param allowZero - Ob 0 erlaubt ist (Standard: true)
 * @returns true, wenn der Wert eine positive Zahl ist, sonst false
 */
export function isPositiveNumber(value: unknown, allowZero: boolean = true): boolean {
  if (!isValidNumber(value)) {
    return false;
  }

  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return allowZero ? num >= 0 : num > 0;
}

/**
 * Prüft, ob ein Wert eine gültige E-Mail ist
 *
 * @param value - Der zu prüfende Wert
 * @returns true, wenn der Wert eine gültige E-Mail ist, sonst false
 */
export function isValidEmail(value: string): boolean {
  if (!value) return false;

  // Einfache E-Mail-Validierung
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Prüft, ob ein Wert ein gültiges Datum ist
 *
 * @param value - Der zu prüfende Wert
 * @returns true, wenn der Wert ein gültiges Datum ist, sonst false
 */
export function isValidDate(value: unknown): boolean {
  if (!value) return false;

  // Versuche, das Datum zu parsen
  const date = new Date(String(value));
  return !isNaN(date.getTime());
}

/**
 * Prüft, ob ein String nicht leer ist (nach Trimming)
 *
 * @param value - Der zu prüfende String
 * @returns true, wenn der String nicht leer ist, sonst false
 */
export function isNonEmptyString(value: string | null | undefined): boolean {
  if (value === null || value === undefined) return false;
  return value.trim().length > 0;
}

/**
 * Prüft, ob ein Wert im angegebenen Bereich liegt
 *
 * @param value - Der zu prüfende Wert
 * @param min - Minimalwert (Standard: -Infinity)
 * @param max - Maximalwert (Standard: Infinity)
 * @returns true, wenn der Wert im angegebenen Bereich liegt, sonst false
 */
export function isInRange(value: number, min: number = -Infinity, max: number = Infinity): boolean {
  if (!isValidNumber(value)) return false;
  return value >= min && value <= max;
}

/**
 * Prüft, ob ein String eine gültige URL ist
 *
 * @param value - Der zu prüfende String
 * @returns true, wenn der String eine gültige URL ist, sonst false
 */
export function isValidUrl(value: string): boolean {
  if (!value) return false;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Prüft, ob ein Wert in einem Array enthalten ist
 *
 * @param value - Der zu prüfende Wert
 * @param allowedValues - Array von erlaubten Werten
 * @returns true, wenn der Wert in dem Array enthalten ist, sonst false
 */
export function isOneOf<T>(value: T, allowedValues: T[]): boolean {
  return allowedValues.includes(value);
}

/**
 * Validiert einen String mit einem regulären Ausdruck
 *
 * @param value - Der zu prüfende String
 * @param pattern - Der reguläre Ausdruck
 * @returns true, wenn der String dem regulären Ausdruck entspricht, sonst false
 */
export function matchesPattern(value: string, pattern: RegExp): boolean {
  if (!value) return false;
  return pattern.test(value);
}
