import chromium from "chrome-aws-lambda";

export default async function handler(req, res) {
  // Chỉ cho phép GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { url, width = 1920, height = 1080, fullPage = "true" } = req.query;

    if (!url) {
      return res.status(400).json({ error: "Thiếu tham số url" });
    }

    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: "URL không hợp lệ" });
    }

    console.log(`Taking screenshot of: ${url}`);

    const browser = await chromium.puppeteer.launch({
      args: [
        ...chromium.args,
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process",
      ],
      defaultViewport: {
        width: parseInt(width),
        height: parseInt(height),
        deviceScaleFactor: 1,
      },
      executablePath: await chromium.executablePath,
      headless: true,
    });

    const page = await browser.newPage();

    // Set user agent để tránh bị block
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    // Set viewport
    await page.setViewport({
      width: parseInt(width),
      height: parseInt(height),
      deviceScaleFactor: 1,
    });

    try {
      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      // Chờ thêm 2 giây cho trang load hoàn toàn
      await page.waitForTimeout(2000);
    } catch (navigationError) {
      console.error("Navigation error:", navigationError);
      await browser.close();
      return res.status(400).json({
        error: "Không thể truy cập website",
        details: navigationError.message,
      });
    }

    const screenshot = await page.screenshot({
      fullPage: fullPage === "true",
      type: "png",
      quality: 90,
    });

    await browser.close();

    // Set headers
    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate=86400"
    );
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");

    console.log(`Screenshot completed for: ${url}`);
    res.status(200).end(screenshot);
  } catch (err) {
    console.error("Screenshot error:", err);
    res.status(500).json({
      error: "Lỗi khi chụp ảnh",
      details: err.message,
    });
  }
}
