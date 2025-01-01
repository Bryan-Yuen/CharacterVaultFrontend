/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://myfapsheet.com',
  generateRobotsTxt: true, // (optional)
  // ...other options
}