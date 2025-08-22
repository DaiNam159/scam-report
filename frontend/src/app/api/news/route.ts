// Next.js 13+ App Router API Route (app/api/news/route.ts)
import Parser from "rss-parser";

const parser = new Parser();

export async function GET() {
  const keywords = [
    "Lừa đảo mạng",
    "Lừa đảo qua điện thoại",
    "Lừa đảo ngân hàng",
    "Lừa đảo qua SMS",
    "Lừa đảo qua email",
    "Lừa đảo trực tuyến",
    "Tổ chức lừa đảo",
  ];

  const combinedQuery = keywords.map((k) => `"${k}"`).join(" OR ");
  const encodedQuery = encodeURIComponent(combinedQuery);
  const feedURL = `https://news.google.com/rss/search?q=${encodedQuery}&hl=vi&gl=VN&ceid=VN:vi`;
  try {
    const feed = await parser.parseURL(feedURL);
    const news = feed.items.map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      contentSnippet: item.contentSnippet,
    }));
    return Response.json(news);
  } catch (error) {
    throw error;
  }
}
