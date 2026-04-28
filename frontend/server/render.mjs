/**
 * Serves the TanStack Start app on Node (e.g. Render Web Service).
 * The production build exposes a fetch() handler; we bridge it to Node's http server.
 *
 * Important: the Cloudflare-oriented handler often returns 404 for /assets/* in plain Node.
 * We serve dist/client (hashed JS/CSS) from disk first so static chunks always load.
 */
import http from "node:http";
import fs from "node:fs";
import fsp from "node:fs/promises";
import { Readable } from "node:stream";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const clientDir = path.join(root, "dist", "client");

const port = Number(process.env.PORT) || 3000;

const MIME = {
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
};

/**
 * @param {string} baseDir absolute path to dist/client
 * @param {string} pathname url pathname e.g. /assets/foo-abc.js
 * @returns {string | null} safe absolute file path or null
 */
function fileUnderClientDir(baseDir, pathname) {
  const raw = pathname.split("?")[0] || "/";
  const rel = path.normalize(decodeURIComponent(raw).replace(/^\/+/, "")).replace(/^(\.\.([/\\]|$))+/, "");
  if (rel === "" || rel === ".") {
    return null;
  }
  const full = path.join(baseDir, rel);
  const baseResolved = path.resolve(baseDir);
  const fullResolved = path.resolve(full);
  if (!fullResolved.startsWith(baseResolved + path.sep) && fullResolved !== baseResolved) {
    return null;
  }
  return fullResolved;
}

const serverIndex = pathToFileURL(path.join(root, "dist/server/index.js")).href;
const { default: handler } = await import(serverIndex);

const server = http.createServer(async (req, res) => {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const proto = req.headers["x-forwarded-proto"] || "http";
  const url = new URL(req.url || "/", `${proto}://${host}`);

  try {
    if (req.method === "GET" || req.method === "HEAD") {
      const onDisk = fileUnderClientDir(clientDir, url.pathname);
      if (onDisk) {
        const st = await fsp.stat(onDisk).catch(() => null);
        if (st?.isFile()) {
          const ext = path.extname(onDisk).toLowerCase();
          const type = MIME[ext] || "application/octet-stream";
          const maxAge = url.pathname.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "no-cache";
          if (req.method === "HEAD") {
            res.writeHead(200, {
              "Content-Type": type,
              "Content-Length": String(st.size),
              "Cache-Control": maxAge,
            });
            return res.end();
          }
          res.writeHead(200, {
            "Content-Type": type,
            "Cache-Control": maxAge,
          });
          return fs.createReadStream(onDisk).on("error", (err) => {
            console.error(err);
            if (!res.headersSent) res.writeHead(500);
            res.end();
          }).pipe(res);
        }
      }
    }

    const init = {
      method: req.method,
      headers: req.headers,
    };
    if (req.method !== "GET" && req.method !== "HEAD" && req.method !== undefined) {
      init.body = req;
      init.duplex = "half";
    }
    const request = new Request(url, init);
    const response = await handler.fetch(request);

    const headers = /** @type {Record<string, string | string[]>} */ ({});
    response.headers.forEach((value, key) => {
      if (key === "set-cookie") {
        const existing = headers[key];
        if (Array.isArray(existing)) existing.push(value);
        else if (existing) headers[key] = [existing, value];
        else headers[key] = value;
      } else {
        headers[key] = value;
      }
    });

    res.writeHead(response.status, headers);

    if (response.body) {
      if (typeof Readable.fromWeb === "function") {
        Readable.fromWeb(response.body).pipe(res);
      } else {
        const reader = response.body.getReader();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) res.write(value);
        }
        res.end();
      }
    } else {
      res.end();
    }
  } catch (e) {
    console.error(e);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "text/plain" });
    }
    res.end(e instanceof Error ? e.message : "Server error");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`DEMO CRM frontend listening on port ${port}`);
  console.log(`[render] static assets from ${clientDir}`);
});
