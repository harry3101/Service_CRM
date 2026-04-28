/**
 * Serves the TanStack Start app on Node (e.g. Render Web Service).
 * The production build exposes a fetch() handler; we bridge it to Node's http server.
 */
import http from "node:http";
import { Readable } from "node:stream";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const port = Number(process.env.PORT) || 3000;

const serverIndex = pathToFileURL(path.join(root, "dist/server/index.js")).href;
const { default: handler } = await import(serverIndex);

const server = http.createServer(async (req, res) => {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const proto = req.headers["x-forwarded-proto"] || "http";
  const url = new URL(req.url || "/", `${proto}://${host}`);

  try {
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
});
