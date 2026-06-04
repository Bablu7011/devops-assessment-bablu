const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

const BACKEND_URL =
  process.env.BACKEND_URL || "http://backend-service:3000";

app.get("/", async (req, res) => {
  let backendData = {
    status: "Disconnected"
  };

  try {
    const response = await fetch(`${BACKEND_URL}/api/info`);
    backendData = await response.json();
  } catch (err) {
    console.log(err.message);
  }

  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>DevOps Assessment</title>
</head>
<body>
  <h1>DevOps Assessment  Cloudmaven infotect by Bablu Intern</h1>

  <h3>Backend Status</h3>

  <pre>${JSON.stringify(backendData, null, 2)}</pre>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`Frontend running on port ${PORT}`);
});