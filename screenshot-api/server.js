import express from "express";
import puppeteer from "puppeteer-core";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/screenshot", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing url parameter" });

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: "/usr/bin/chromium", // đường dẫn Chromium sau khi cài
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const screenshot = await page.screenshot({ encoding: "base64" });
    await browser.close();

    res.set("Content-Type", "text/html");
    res.send(`<img src="data:image/png;base64,${screenshot}" />`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server chạy ở http://localhost:${PORT}`));
