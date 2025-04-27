/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: [],
    },
    // This is important for proper route replacement,
    // since we used '[id]' in the file structure due to Windows limitations
    pageExtensions: ['tsx', 'ts', 'jsx', 'js'],

    // Experimental options
    experimental: {},

    // Environment variables accessible on the client
    env: {
        NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
        NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    },

    // Custom webpack configuration if needed
    webpack: (config, { isServer }) => {
        // Add custom webpack configuration here if necessary
        return config;
    },

    // Headers for better security
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                ],
            },
        ];
    },

    // Redirects if needed
    async redirects() {
        return [];
    },

    // Rewrites if needed
    async rewrites() {
        return [];
    },
};

module.exports = nextConfig;