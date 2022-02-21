const express = require("express");
const next = require("next");
const axios = require("axios")
const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const GITHUB_CLIENT_SECRET = '0fafffb3638af1cf2ef299bbe6eb61de7ef2ca96'
const GITHUB_CLIENT_ID = '9606c47f2e7920cd1f98'


app
  .prepare()
  .then(() => {
    // const showRoutes = require("./pages/index.js");
    const server = express(); 

    // server.use("/api", showRoutes(server));
    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, err => {
      if (err) throw err;
      console.log(`> Ready on ${PORT}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });

