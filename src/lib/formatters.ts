/**
 * Funktionen zur Formatierung von Daten
 */

/**
 * Formatiert eine Zahl mit Dezimalstellen und Tausendertrennzeichen
 *
 * @param value - Die zu formatierende Zahl
 * @param decimals - Anzahl der Dezimalstellen (Standard: 2)
 * @param decimalSeparator - Dezimaltrennzeichen (Standard: ',')
 * @param thousandsSeparator - Tausendertrennzeichen (Standard: '.')
 * @returns Formatierte Zahl als String
 */
export function formatNumber(
  value: number | null | undefined,
  decimals: number = 2,
  decimalSeparator: string = ',',
  thousandsSeparator: string = '.'
): string {
  if (value === null || value === undefined) {
    return '';
  }

  const valueStr = value.toFixed(decimals);
  const [integerPart, fractionalPart] = valueStr.split('.');

  // Tausendertrennzeichen einfügen
  const integerWithSeparator = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);

  // Dezimalteil nur hinzufügen, wenn er existiert
  return fractionalPart
    ? `${integerWithSeparator}${decimalSeparator}${fractionalPart}`
    : integerWithSeparator;
}

/**
 * Formatiert einen Währungsbetrag
 *
 * @param value - Der zu formatierende Betrag
 * @param currency - Währungssymbol (Standard: '€')
 * @param decimals - Anzahl der Dezimalstellen (Standard: 2)
 * @returns Formatierter Währungsbetrag als String
 */
export function formatCurrency(
  value: number | null | undefined,
  currency: string = '€',
  decimals: number = 2
): string {
  if (value === null || value === undefined) {
    return '';
  }

  return `${formatNumber(value, decimals)} ${currency}`;
}

/**
 * Formatiert Quadratmeter
 *
 * @param value - Der zu formatierende Wert
 * @param decimals - Anzahl der Dezimalstellen (Standard: 2)
 * @returns Formatierter Quadratmeterwert als String
 */
export function formatSquareMeters(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) {
    return '';
  }

  return `${formatNumber(value, decimals)} m²`;
}

/**
 * Formatiert Stunden
 *
 * @param value - Der zu formatierende Stundenwert
 * @param decimals - Anzahl der Dezimalstellen (Standard: 2)
 * @returns Formatierter Stundenwert als String
 */
export function formatHours(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) {
    return '';
  }

  return `${formatNumber(value, decimals)} h`;
}

/**
 * Formatiert ein Datum
 *
 * @param date - Das zu formatierende Datum
 * @param locale - Die zu verwendende Locale (Standard: 'de-DE')
 * @returns Formatiertes Datum als String
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  locale: string = 'de-DE'
): string {
  if (!date) {
    return '';
  }

  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString(locale);
}

/**
 * Konvertiert einen String-Wert sicher in eine Zahl
 *
 * @param value - Der zu konvertierende Wert
 * @param defaultValue - Standardwert, falls Konvertierung nicht möglich (Standard: 0)
 * @returns Konvertierte Zahl oder Standardwert
 */
export function toNumber(
  value: string | number | null | undefined,
  defaultValue: number = 0
): number {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }

  const parsed = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(parsed) ? defaultValue : parsed;
}
