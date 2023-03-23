// @ts-ignore
const express = require("express");
const next = require("next");
const { createProxyMiddleware } = require("http-proxy-middleware");

const port = 3300;
const app = next({ dev: true });
const handle = app.getRequestHandler();

let target = ""; // 开发环境
if (process.env.PACKAGE_ENV === "ALPHA") {
  target = ""; //测试环境
} else if (process.env.PACKAGE_ENV === "RELEASE") {
  target = ""; // 正式环境
}

const proxyTable = {
  "/api": {
    target,
    pathRewrite: {
      "^/api": "/api",
    },
    changeOrigin: true,
    secure: false,
  },
};

app
  .prepare()
  .then(() => {
    const server = express();

    server.use("/api", createProxyMiddleware(proxyTable["/api"]));

    // @ts-ignore
    server.all("*", (req, res) => {
      return handle(req, res);
    });

    // @ts-ignore
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`Ready on http://localhost:${port}`);
    });
  })
  // @ts-ignore
  .catch((err) => {
    console.log("Error:::::", err);
  });
