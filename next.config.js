// me telling nextjs which url's my external pictures are allowed from
/** @type {import('next').NextConfig} */
const nextConfig = { images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'testing-pictures.myfapsheet.com',
      pathname: '**',
    },
    {
      protocol: 'https',
      hostname: 'home-page-pictures.myfapsheet.com',
      pathname: '**',
    },
    {
      protocol: 'https',
      hostname: 'demo-pornstars.myfapsheet.com',
      pathname: '**',
    },
    {
      protocol: 'https',
      hostname: 'home-page-video.myfapsheet.com',
      pathname: '**',
    },
  ],
}}

module.exports = nextConfig
