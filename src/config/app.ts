/**
 * Allgemeine Anwendungseinstellungen für die RitterDigitalAuswertung-Anwendung.
 */

export const APP_CONFIG = {
  title: 'Ritter Digital Raumbuch Auswertung',
  description: 'Auswertungstool für das Raumbuch-System',
  version: '1.0.0',
  debug: process.env.NODE_ENV === 'development',
  host: process.env.HOST || '0.0.0.0',
  port: parseInt(process.env.PORT || '3000', 10),
};

// Export-Einstellungen
export const EXPORT_CONFIG = {
  excel: {
    enabled: true,
    folder: '/tmp/exports', // Wird bei Vercel nicht verwendet, aber für lokale Entwicklung
  },
  pdf: {
    enabled: true,
    folder: '/tmp/exports', // Wird bei Vercel nicht verwendet, aber für lokale Entwicklung
  },
};

// Theme Konfiguration
export const THEME_CONFIG = {
  colors: {
    primary: {
      50: '#e6f0f9',
      100: '#cce0f3',
      200: '#99c2e6',
      300: '#66a3da',
      400: '#3385cd',
      500: '#0066c1',
      600: '#00529a',
      700: '#003d74',
      800: '#00294d',
      900: '#001427',
    },
    secondary: {
      50: '#fff8e6',
      100: '#fff1cc',
      200: '#ffe499',
      300: '#ffd666',
      400: '#ffc933',
      500: '#ffbb00',
      600: '#cc9600',
      700: '#997000',
      800: '#664b00',
      900: '#332500',
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};
