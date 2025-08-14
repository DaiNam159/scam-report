import express from "express";
import screenshotHandler from "./api/screenshot.js";

const app = express();
const PORT = process.env.PORT || 3000;

const express = require("express");
const puppeteer = require("puppeteer");

app.get("api/screenshot", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto("https://example.com");
    const screenshot = await page.screenshot({ encoding: "base64" });
    await browser.close();

    res.send(`<img src="data:image/png;base64,${screenshot}" />`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
