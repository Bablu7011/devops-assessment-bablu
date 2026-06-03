const express = require("express");
const client = require("prom-client");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * =========================
 * Prometheus Metrics Setup
 * =========================
 */

// Collect default Node.js metrics
client.collectDefaultMetrics();

// HTTP request counter
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

// HTTP request duration histogram
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5],
});

/**
 * =========================
 * Logging (Morgan JSON)
 * =========================
 */

morgan.token("json", (req, res) => {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    method: req.method,
    endpoint: req.originalUrl,
    status_code: res.statusCode,
    user_agent: req.headers["user-agent"],
  });
});

app.use(
  morgan(":json", {
    stream: {
      write: (message) => console.log(message.trim()),
    },
  })
);

/**
 * =========================
 * Metrics Middleware
 * =========================
 */

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;

    const route = req.route?.path || req.path;

    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode,
    });

    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status_code: res.statusCode,
      },
      duration
    );
  });

  next();
});

/**
 * =========================
 * Routes
 * =========================
 */


app.get("/error", (req, res) => {
  res.status(500).json({
    error: "Internal Server Error"
  });
});


app.get("/", (req, res) => {
  res.json({
    message: "Backend Running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
  });
});

app.get("/api/info", (req, res) => {
  res.json({
    project: process.env.APP_NAME,
    environment: process.env.APP_ENV || "dev",
    version: "1.0.0",
  });
});

/**
 * =========================
 * Prometheus Metrics Endpoint
 * =========================
 */

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

/**
 * =========================
 * Start Server
 * =========================
 */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});