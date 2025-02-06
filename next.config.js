// me telling nextjs which url's my external pictures are allowed from
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "testing-pictures.myfapsheet.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "home-page-pictures.myfapsheet.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "ad-banners.myfapsheet.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "demo-pornstars.myfapsheet.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "demo-list-pornstar-pictures.myfapsheet.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "home-page-video.myfapsheet.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "pornstar-pictures.myfapsheet.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "pornstar-pictures-cdn.myfapsheet.com",
        pathname: "**",
      },
      // demo list
      {
        protocol: "https",
        hostname: "https://pub-e6bebdc4320d4f6ab48cf5edf2c48e9c.r2.dev",
        pathname: "**",
      },
       // home page pictures
       {
        protocol: "https",
        hostname: "https://pub-6aa58914a36048c298f2af9531d479c2.r2.dev",
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