/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "http://localhost:3000",
  generateRobotsTxt: true,
  sitemapSize: 7000,

  // Bỏ qua các route không muốn đưa vào sitemap
  exclude: ["/admin/*"],

  // Tùy chỉnh robots.txt
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin"], // chặn toàn bộ /admin
      },
    ],
    sitemap: `${process.env.SITE_URL || "http://localhost:3000"}/sitemap.xml`,
  },
};
