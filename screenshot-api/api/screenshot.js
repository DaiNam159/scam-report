import chromium from "chrome-aws-lambda";

export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "Thiếu tham số url" });
    }

    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const screenshot = await page.screenshot({ fullPage: true });
    await browser.close();

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "s-maxage=86400"); // cache 1 ngày
    res.status(200).end(screenshot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi chụp ảnh" });
  }
}
