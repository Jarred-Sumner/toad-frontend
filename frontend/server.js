const next = require("next");
const routes = require("./routes");
const app = next({ dev: process.env.NODE_ENV !== "production" });
const handler = routes.getRequestHandler(app);
const path = require("path");

// With express
const express = require("express");

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();
  server.use("/static", express.static(path.join(__dirname, ".next/static")));
  server.use(handler);

  server.listen(PORT, err => {
    if (err) {
      throw err;
    }

    console.log(`Toads is listening on ${process.env.BASE_DOMAIN}:${PORT}`);
  });
});

process.on("uncaughtException", function(error) {
  console.error(error);
});
