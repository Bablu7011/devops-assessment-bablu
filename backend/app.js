const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = process.env.PORT || 3000;

// ----------------------------------------------------
// 1. Prometheus Metrics Configuration
// ----------------------------------------------------
client.collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

const httpErrorsTotal = new client.Counter({
  name: "http_errors_total",
  help: "Total number of HTTP errors",
  labelNames: ["method", "route", "status_code"],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5],
});

// ----------------------------------------------------
// 2. Logging & Metrics Middleware
// ----------------------------------------------------
app.use((req, res, next) => {
  const start = process.hrtime(); // High-precision timer for accurate metrics

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const responseTimeInSeconds = diff[0] + diff[1] / 1e9;
    const responseTimeInMs = responseTimeInSeconds * 1000;

    // Use route path pattern instead of originalUrl to prevent high cardinality issues
    const normalizedRoute = req.route ? req.route.path : req.path;

    const metricLabels = {
      method: req.method,
      route: normalizedRoute,
      status_code: res.statusCode,
    };

    // Structured JSON Logging
    const log = {
      timestamp: new Date().toISOString(),
      level: res.statusCode >= 400 ? "ERROR" : "INFO",
      method: req.method,
      endpoint: req.originalUrl,
      route: normalizedRoute,
      statusCode: res.statusCode,
      responseTimeMs: parseFloat(responseTimeInMs.toFixed(2)),
      ip: req.ip,
      userAgent: req.get("User-Agent") || "unknown",
    };
    console.log(JSON.stringify(log));

    // Record Prometheus Metrics
    httpRequestsTotal.inc(metricLabels);
    httpRequestDuration.observe(metricLabels, responseTimeInSeconds);

    if (res.statusCode >= 400) {
      httpErrorsTotal.inc(metricLabels);
    }
  });

  next();
});

// ----------------------------------------------------
// 3. Application Routes
// ----------------------------------------------------
app.get("/", (req, res) => {
  res.json({ message: "Backend Running" });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
  });
});

app.get("/api/info", (req, res) => {
  res.json({
    project: process.env.APP_NAME || "devops-assessment",
    environment: process.env.APP_ENV || "dev",
    version: "1.0.0",
  });
});

app.get("/success", (req, res) => {
  res.status(200).json({ message: "Success" });
});

app.get("/not-found", (req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.get("/error", (req, res) => {
  res.status(500).json({ error: "Internal Server Error" });
});

app.get("/slow", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  res.status(200).json({ message: "Slow Endpoint" });
});

// ----------------------------------------------------
// 4. Prometheus Scrape Endpoint
// ----------------------------------------------------
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
});

// ----------------------------------------------------
// 5. Server Initialization
// ----------------------------------------------------
app.listen(PORT, () => {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "INFO",
      message: `Server running on port ${PORT}`,
    })
  );
});