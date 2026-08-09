const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");

const root = __dirname;
const port = Number(process.env.LIFEOPS_PORT || 4198);
const host = process.env.LIFEOPS_HOST || "0.0.0.0";
const localUrl = `http://127.0.0.1:${port}/lifeops-dashboard.html`;

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".json": "application/json; charset=utf-8",
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);
  const pathname = decodeURIComponent(url.pathname === "/" ? "/lifeops-dashboard.html" : url.pathname);
  const target = path.resolve(root, `.${pathname}`);
  if (!target.startsWith(root)) return send(res, 403, "Forbidden");
  fs.readFile(target, (error, data) => {
    if (error) return send(res, 404, "Not found");
    send(res, 200, data, types[path.extname(target).toLowerCase()] || "application/octet-stream");
  });
});

function networkUrls() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter(details => details && details.family === "IPv4" && !details.internal)
    .map(details => `http://${details.address}:${port}/lifeops-dashboard.html`);
}

server.listen(port, host, () => {
  const urls = networkUrls();
  console.log("LifeOps preview server running.");
  console.log(`Laptop URL: ${localUrl}`);
  if (urls.length) {
    console.log("Phone/tablet URLs on the same Wi-Fi:");
    urls.forEach(url => console.log(`  ${url}`));
  } else {
    console.log("No Wi-Fi/LAN address found. Run ipconfig and use your IPv4 address if needed.");
  }
  console.log("If another device cannot connect, allow Node.js through Windows Firewall for private networks.");
});
