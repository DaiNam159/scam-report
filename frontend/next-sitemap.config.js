/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "http://localhost:3000", // domain của bạn
  generateRobotsTxt: true, // tạo luôn robots.txt
  sitemapSize: 7000,
};
