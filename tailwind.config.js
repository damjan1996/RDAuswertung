/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Ritter Digital Farbpalette
                primary: {
                    DEFAULT: 'rgb(35, 40, 45)', // Primärfarbe für Strukturierung
                    50: 'rgb(244, 245, 246)', // Basisfarbe für den Hintergrund
                    100: 'rgb(220, 225, 230)',
                    200: 'rgb(180, 195, 210)',
                    300: 'rgb(140, 160, 180)',
                    400: 'rgb(100, 125, 150)',
                    500: 'rgb(80, 105, 125)', // Hauptfarbe für Hintergrund- und Textboxen
                    600: 'rgb(58, 79, 102)', // Sekundäre Akzentfarbe
                    700: 'rgb(45, 60, 80)',
                    800: 'rgb(35, 40, 45)',
                    900: 'rgb(25, 30, 35)',
                },
                accent: {
                    DEFAULT: 'rgb(255, 138, 76)', // Akzentfarbe für Highlights und CTAs
                    50: 'rgb(255, 240, 230)',
                    100: 'rgb(255, 220, 200)',
                    200: 'rgb(255, 200, 170)',
                    300: 'rgb(255, 180, 140)',
                    400: 'rgb(255, 160, 110)',
                    500: 'rgb(255, 138, 76)',
                    600: 'rgb(230, 120, 60)',
                    700: 'rgb(200, 100, 50)',
                    800: 'rgb(170, 80, 40)',
                    900: 'rgb(140, 60, 30)',
                },
                secondary: {
                    DEFAULT: 'rgb(58, 79, 102)', // Sekundäre Akzentfarbe
                    50: 'rgb(230, 235, 240)',
                    100: 'rgb(200, 210, 220)',
                    200: 'rgb(170, 185, 200)',
                    300: 'rgb(140, 160, 180)',
                    400: 'rgb(100, 120, 140)',
                    500: 'rgb(80, 100, 120)',
                    600: 'rgb(58, 79, 102)',
                    700: 'rgb(45, 65, 85)',
                    800: 'rgb(35, 50, 65)',
                    900: 'rgb(25, 35, 45)',
                },
                background: 'rgb(244, 245, 246)', // Basisfarbe für den Hintergrund
                // Behalte die Utility-Farben bei
                success: {
                    DEFAULT: '#28a745',
                    light: '#d4edda',
                    dark: '#155724',
                },
                danger: {
                    DEFAULT: '#dc3545',
                    light: '#f8d7da',
                    dark: '#721c24',
                },
                info: {
                    DEFAULT: '#17a2b8',
                    light: '#d1ecf1',
                    dark: '#0c5460',
                },
                warning: {
                    DEFAULT: '#ffc107',
                    light: '#fff3cd',
                    dark: '#856404',
                },
            },
            fontFamily: {
                sans: [
                    'Segoe UI',
                    'system-ui',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Roboto',
                    'Helvetica Neue',
                    'Arial',
                    'sans-serif',
                ],
            },
            boxShadow: {
                sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
                none: 'none',
            },
            borderWidth: {
                6: '6px',
            },
            minHeight: {
                72: '18rem',
                36: '9rem',
            },
            animation: {
                spin: 'spin 1.2s linear infinite',
            },
            keyframes: {
                spin: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
            },
            screens: {
                xs: '480px',
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
                '2xl': '1536px',
            },
            spacing: {
                // Add any custom spacing values if needed
            },
            zIndex: {
                // Add any custom z-index values if needed
            },
        },
    },
    plugins: [
        require('tailwindcss-animate'),
    ],
};