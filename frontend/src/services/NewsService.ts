// lib/newsService.js
import Parser from "rss-parser";

const parser = new Parser();

export async function fetchNewsByTopic(topic = "tin-moi-nhat") {
  // Nếu đang ở client, gọi API route thay vì rss-parser trực tiếp
  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/news?topic=${encodeURIComponent(topic)}`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }
  // Chỉ chạy trên server (Node.js), không chạy trên trình duyệt
  const feedURL = `https://vnexpress.net/rss/${topic}.rss`;

  try {
    const feed = await parser.parseURL(feedURL);
    return feed.items.map((item) => ({
      title: item.title ?? "",
      link: item.link ?? "",
      pubDate: item.pubDate,
      contentSnippet: item.contentSnippet,
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}
