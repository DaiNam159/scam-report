import express from "express";
import screenshotHandler from "./api/screenshot.js";

const app = express();
const port = 8080;

app.get("/api/screenshot", (req, res) => {
  screenshotHandler(req, res); // gọi thẳng hàm handler
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
