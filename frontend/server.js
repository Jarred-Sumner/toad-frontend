require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env"
});

const next = require("next");
const routes = require("./routes");
const config = require("./config");
const app = next({ dev: !config.isProduction() });
const handler = routes.getRequestHandler(app);
const path = require("path");
const Raven = require("raven");
const requestIp = require("request-ip");

Raven.config(config.SENTRY_URL).install();

// With express
const express = require("express");

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();
  server.use("/static", express.static(path.join(__dirname, ".next/static")));
  server.use(requestIp.mw());
  server.use(handler);

  server.listen(PORT, err => {
    if (err) {
      throw err;
    }

    console.log(`Toads is listening on ${config.BASE_DOMAIN}:${PORT}`);
  });
});

process.on("uncaughtException", function(error) {
  console.error(error);
});
