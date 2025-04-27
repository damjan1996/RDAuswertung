import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Kombiniert CSS-Klassen mit Tailwind-Merge
 *
 * @param inputs - Die zu kombinierenden CSS-Klassen
 * @returns Kombinierte und bereinigte CSS-Klassen
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Erzeugt ein Array mit einer Reihe von Zahlen
 *
 * @param start - Startwert (einschließlich)
 * @param end - Endwert (einschließlich)
 * @returns Array mit Zahlen im angegebenen Bereich
 */
export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Verzögert die Ausführung eines Codes um eine angegebene Zeit
 *
 * @param ms - Verzögerungszeit in Millisekunden
 * @returns Promise, das nach der Verzögerungszeit aufgelöst wird
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Truncate text to a specific length and append ellipsis if needed
 *
 * @param text - Text to truncate
 * @param length - Maximum length (default: 50)
 * @param ellipsis - String to append if truncated (default: '...')
 * @returns Truncated text
 */
export function truncateText(text: string, length: number = 50, ellipsis: string = '...'): string {
  if (!text || text.length <= length) {
    return text;
  }
  return text.substring(0, length) + ellipsis;
}

/**
 * Makes the first letter of a string uppercase
 *
 * @param text - Text to transform
 * @returns Text with first letter capitalized
 */
export function capitalizeFirstLetter(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Filters out null and undefined values from an array
 *
 * @param array - Array to filter
 * @returns Array without null or undefined values
 */
export function filterNullish<T>(array: (T | null | undefined)[]): T[] {
  return array.filter((item): item is T => item !== null && item !== undefined);
}

/**
 * Generates a random ID
 *
 * @param length - Length of the ID (default: 8)
 * @returns Random ID
 */
export function generateId(length: number = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

/**
 * Groups an array of objects by a specific key
 *
 * @param array - Array of objects to group
 * @param key - Key to group by
 * @returns Object with grouped items
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const keyValue = String(item[key]);
      result[keyValue] = result[keyValue] || [];
      result[keyValue].push(item);
      return result;
    },
    {} as Record<string, T[]>
  );
}

/**
 * Safely accesses a nested property in an object using a path
 *
 * @param obj - Object to access
 * @param path - Path to the property (e.g., "a.b.c")
 * @param defaultValue - Default value if property doesn't exist
 * @returns The property value or default value
 */
export function getNestedProperty<T>(obj: Record<string, any>, path: string, defaultValue: T): T {
  const keys = path.split('.');
  let result = obj;

  for (let i = 0; i < keys.length; i++) {
    if (result === undefined || result === null) {
      return defaultValue;
    }
    result = result[keys[i]];
  }

  return result === undefined || result === null ? defaultValue : (result as T);
}
