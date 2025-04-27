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
                primary: {
                    DEFAULT: '#003366',
                    50: '#E6F0F9',
                    100: '#CCE0F2',
                    200: '#99C2E6',
                    300: '#66A3D9',
                    400: '#3385CC',
                    500: '#0066BF',
                    600: '#005299',
                    700: '#003D73',
                    800: '#00294D',
                    900: '#001426',
                },
                secondary: {
                    DEFAULT: '#f08c00',
                    50: '#FFF8E6',
                    100: '#FFF0CC',
                    200: '#FFE299',
                    300: '#FFD366',
                    400: '#FFC533',
                    500: '#FFB600',
                    600: '#CC9200',
                    700: '#996D00',
                    800: '#664900',
                    900: '#332400',
                },
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