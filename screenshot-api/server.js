import express from "express";
import screenshotHandler from "./api/screenshot.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/screenshot", (req, res) => {
  screenshotHandler(req, res); // gọi thẳng hàm handler
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
