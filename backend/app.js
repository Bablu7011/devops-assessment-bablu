const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
res.json({
message: "Backend Running"
});
});


app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime()
  });
});



app.get("/api/info", (req, res) => {
res.json({
project: process.env.APP_NAME,
environment: process.env.APP_ENV || "dev",
version: "1.0.0"
});
});



client.collectDefaultMetrics();

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
