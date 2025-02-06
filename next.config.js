// me telling nextjs which url's my external pictures are allowed from
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // demo list
      {
        protocol: "https",
        hostname: "https://demo-list-actor-pictures.charactervault.site",
        pathname: "**",
      },
       // home page pictures
       {
        protocol: "https",
        hostname: "https://character-vault-homepage-pictures.charactervault.site",
        pathname: "**",
      },
       // actor pictures
       {
        protocol: "https",
        hostname: "https://actor-pictures.charactervault.site",
        pathname: "**",
      },
    ],
  },
  swcMinify: true, // Ensure SWC minification is enabled
  compiler: {
    removeConsole: process.env.NEXT_PUBLIC_ENVIRONMENT === 'PRODUCTION'
      ? {
          exclude: ['error', 'warn'], // Keep error and warn logs if needed
        }
      : false,
  },
};

module.exports = nextConfig;