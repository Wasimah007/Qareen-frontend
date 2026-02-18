/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    NEXT_PUBLIC_APP_NAME: 'Qareen',
  },
  i18n: {
    locales: ['en', 'ar', 'ur', 'fr', 'tr'],
    defaultLocale: 'en',
  },
}

module.exports = nextConfig
