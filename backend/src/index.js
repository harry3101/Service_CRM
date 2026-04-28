import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDb } from "./db.js";
import { initAuth, getAuthMode } from "./middleware/auth.js";
import { apiRouter } from "./routes/api.js";

const app = express();
const port = Number(process.env.PORT) || 4000;

/** Any port: Vite 5173/4173, dev servers on 8080, 3000, etc. */
const LOCAL_DEV = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/i;

const corsConfig = {
  origin: (requestOrigin, callback) => {
    if (!requestOrigin) {
      return callback(null, true);
    }
    if (LOCAL_DEV.test(requestOrigin)) {
      return callback(null, true);
    }
    const extra = (process.env.CORS_ORIGIN || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (extra.includes(requestOrigin)) {
      return callback(null, true);
    }
    console.warn(`[cors] blocked: ${requestOrigin} — add to CORS_ORIGIN in backend .env`);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 204,
  maxAge: 86400,
};

app.use(cors(corsConfig));
app.use(express.json());

app.get("/health", (_req, res) => {
  const mongoOk = mongoose.connection.readyState === 1;
  res.json({
    ok: true,
    mongo: mongoOk ? "connected" : "disconnected",
    auth: getAuthMode(),
  });
});

app.get("/", (_req, res) => {
  res.type("text/plain").send(
    "DEMO CRM API\n" +
      "  GET  /health   — liveness (Mongo + Firebase status)\n" +
      "  /api/*          — protected JSON API (Authorization: Bearer <idToken>)\n"
  );
});

app.use("/api", apiRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal error" });
});

initAuth();

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`DEMO CRM API listening on http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.error("MongoDB connection failed:", e);
    process.exit(1);
  });
