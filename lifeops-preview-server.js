const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.LIFEOPS_PORT || 4198);
const host = "127.0.0.1";

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
  const url = new URL(req.url || "/", `http://${host}:${port}`);
  const pathname = decodeURIComponent(url.pathname === "/" ? "/lifeops-dashboard.html" : url.pathname);
  const target = path.resolve(root, `.${pathname}`);
  if (!target.startsWith(root)) return send(res, 403, "Forbidden");
  fs.readFile(target, (error, data) => {
    if (error) return send(res, 404, "Not found");
    send(res, 200, data, types[path.extname(target).toLowerCase()] || "application/octet-stream");
  });
});

server.listen(port, host, () => {
  console.log(`LifeOps preview server running at http://${host}:${port}/lifeops-dashboard.html`);
});
