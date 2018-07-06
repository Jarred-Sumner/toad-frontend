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
const cookieParser = require("cookie-parser");
const fetch = require("node-fetch");

Raven.config(config.SENTRY_URL).install();

// With express
const express = require("express");

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();
  server.use("/static", express.static(path.join(__dirname, ".next/static")));
  server.use(requestIp.mw());
  server.use(cookieParser());
  server.use((req, res, next) => {
    if (!req.headers["accept"] || !req.headers["accept"].includes("html")) {
      next();
      return;
    }

    const sessionCookie = req.cookies["toads_session"];

    if (!sessionCookie) {
      fetch(config.BASE_HOSTNAME + "/session", {
        method: "POST",
        credentials: "include"
      })
        .then(response => response.json())
        .then(json => {
          if (json.toads_session) {
            return json.toads_session;
          } else {
            return null;
          }
        })
        .then(
          sessionCookie => {
            res.cookie("toads_session", sessionCookie, {
              expires: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
              ),
              httpOnly: true,
              domain: config.isProduction()
                ? `.${config.BASE_DOMAIN}`
                : undefined,
              secure: config.isProduction()
            });
            req.headers["Cookie"] = "toads_session=" + sessionCookie;
            next();
          },
          () => next()
        );
    } else {
      next();
    }
  });
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
