import { readFileSync, existsSync } from "node:fs";
import admin from "firebase-admin";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { Profile } from "../models/Profile.js";
import { UserRole } from "../models/UserRole.js";

let adminReady = false;
let jwksProjectId = null;
let jwks = null;

const JWKS_URL =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

function loadServiceAccountJson() {
  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_FILE;
  if (filePath && existsSync(filePath)) {
    return JSON.parse(readFileSync(filePath, "utf8"));
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw?.trim()) {
    return JSON.parse(raw);
  }
  return null;
}

/**
 * Init Firebase Admin if credentials present; also enable JWKS path when FIREBASE_PROJECT_ID is set.
 */
export function initAuth() {
  if (adminReady) return;
  let cred = null;
  try {
    cred = loadServiceAccountJson();
  } catch (e) {
    console.error("[auth] Invalid FIREBASE_SERVICE_ACCOUNT / file", e.message);
  }
  if (cred) {
    try {
      if (!admin.apps.length) {
        admin.initializeApp({ credential: admin.credential.cert(cred) });
      }
      adminReady = true;
      console.log("[auth] Using Firebase Admin SDK (service account) for ID token verification.");
    } catch (e) {
      console.error("[auth] Firebase Admin init failed", e.message);
    }
  } else {
    console.warn(
      "[auth] No FIREBASE_SERVICE_ACCOUNT: profile displayName from Google requires Admin, or set env below."
    );
  }

  const pid = (process.env.FIREBASE_PROJECT_ID || "").trim();
  if (pid) {
    jwksProjectId = pid;
    jwks = createRemoteJWKSet(new URL(JWKS_URL));
    console.log(
      `[auth] ID tokens verified with JWKS (FIREBASE_PROJECT_ID=${pid}). Optional: add service account for getUser().`
    );
  } else if (!adminReady) {
    console.error(
      "[auth] Set FIREBASE_PROJECT_ID (e.g. service-crm-22356) in backend .env, or a service account JSON, or API will return 503 on /api/*."
    );
  }
}

export function isAuthReady() {
  return adminReady || !!jwksProjectId;
}

export function getAuthMode() {
  if (adminReady) return "firebase_admin";
  if (jwksProjectId) return "jwks";
  return "none";
}

/**
 * @param {string} idToken
 * @returns {Promise<{ uid: string, email?: string, name?: string }>}
 */
async function verifyIdTokenJose(idToken) {
  const { payload } = await jwtVerify(idToken, jwks, {
    issuer: `https://securetoken.google.com/${jwksProjectId}`,
    audience: jwksProjectId,
    clockTolerance: "30s",
  });
  return {
    uid: payload.sub,
    email: typeof payload.email === "string" ? payload.email : undefined,
    name: typeof payload.name === "string" ? payload.name : undefined,
  };
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export async function requireAuth(req, res, next) {
  if (!isAuthReady()) {
    return res.status(503).json({
      error: "Server auth is not configured",
      hint: "Set FIREBASE_PROJECT_ID in backend .env (match Firebase console project), or set FIREBASE_SERVICE_ACCOUNT.",
    });
  }
  const h = req.headers.authorization;
  const token = h?.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Missing Authorization Bearer token" });
  }
  try {
    if (adminReady) {
      const decoded = await admin.auth().verifyIdToken(token);
      req.user = {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name,
      };
    } else {
      const v = await verifyIdTokenJose(token);
      req.user = { uid: v.uid, email: v.email, name: v.name };
    }
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/** @param {string|undefined} nameFromToken "name" claim in JWT (e.g. Google) */
export async function ensureUserRecords(uid, email, nameFromToken) {
  let fullName = nameFromToken || (email ? email.split("@")[0] : "User");
  if (adminReady) {
    try {
      const rec = await admin.auth().getUser(uid);
      if (rec.displayName) fullName = rec.displayName;
    } catch {
      /* ignore */
    }
  }

  let profile = await Profile.findOne({ userId: uid });
  if (!profile) {
    profile = await Profile.create({
      userId: uid,
      fullName,
      phone: "",
    });
  }
  const count = await UserRole.countDocuments({ userId: uid });
  if (count === 0) {
    await UserRole.create({ userId: uid, role: "admin" });
  }
}
