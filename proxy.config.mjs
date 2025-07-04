import * as fs from "fs";

const targets = [
   'http://localhost:8008',     // 1
  // "http://localhost:30008", // 1
];

const PROXY_CONFIG = {
  "^/version.json$": {
    bypass: (req, res, proxyOptions) => {
      let url;
      if (req.url === "/version.json") {
        url = "src/version.json";
      } else if (req.url === "/configuration.json") {
        url = "src/configuration.json";
      } else if (req.url === "/onboarding.json") {
        url = "src/onboarding.json";
      } else {
        return req.url;
      }

      const ver = fs.readFileSync(url);
      res.writeHead(200, {
        "Content-Length": ver.length,
        "Content-Type": "application/json",
      });
      res.end(ver);
      return true;
    },
  },
};

targets.forEach((target, i) => {
  const path = `/service/${i + 1}/api`;
  PROXY_CONFIG[path] = {
    target: target,
    secure: true,
    changeOrigin: true,
    cookieDomainRewrite: "localhost",
    logLevel: "debug",
    pathRewrite: {
      [`^${path}`]: "",
    },
  };
});

export default PROXY_CONFIG;
