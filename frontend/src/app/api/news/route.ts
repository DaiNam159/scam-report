// Next.js 13+ App Router API Route (app/api/news/route.ts)
import { NextRequest } from "next/server";
import Parser from "rss-parser";

const parser = new Parser();

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const encodedKeyword = encodeURIComponent("An ninh mạng");
  const feedURL = `https://news.google.com/rss/search?q=${encodedKeyword}&hl=vi&gl=VN&ceid=VN:vi`;
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
    return Response.json([]);
  }
}
