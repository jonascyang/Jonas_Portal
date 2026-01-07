/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.notion.so',
      },
      {
        protocol: 'https',
        hostname: 'notion.so',
      },
      {
        protocol: 'https',
        hostname: 'files.notion.so',
      },
    ],
  },
}

module.exports = nextConfig
