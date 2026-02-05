import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import express, { type RequestHandler } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promises as fs } from "node:fs";
import { execSync } from "node:child_process";

// Always load apps/llm/.env regardless of where node is started from
dotenv.config({ path: new URL("../.env", import.meta.url) });

type AnyRouterModule = {
  default?: any;
  [key: string]: any;
};

async function loadRouter(modulePath: string, namedExport: string): Promise<RequestHandler> {
  const mod = (await import(modulePath)) as AnyRouterModule;
  const router = (mod as any)[namedExport] ?? mod.default;
  if (!router) {
    const keys = Object.keys(mod ?? {});
    throw new Error(
      `[llm] Router module '${modulePath}' did not export '${namedExport}' or a default export. Available exports: ${keys.join(", ")}`
    );
  }
  return router as RequestHandler;
}

function envList(name: string, fallback: string[]) {
  const raw = process.env[name];
  if (!raw) return fallback;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// -----------------------------
// Routers (loaded dynamically)
// -----------------------------
let healthRouter: RequestHandler;
let transactionsRouter: RequestHandler;

try {
  healthRouter = await loadRouter("./routes/health.js", "healthRouter");
} catch (e: any) {
  // Always keep service up
  healthRouter = ((req, res) => {
    res.status(500).json({ ok: false, error: e?.message ?? "Failed to load health router" });
  }) as RequestHandler;
}

try {
  transactionsRouter = await loadRouter("./routes/transactions.js", "transactionsRouter");
} catch (e: any) {
  // If supabase env is missing or router fails to import, keep server running
  transactionsRouter = ((req, res) => {
    res.status(500).json({
      ok: false,
      error:
        e?.message ??
        "Failed to load transactions router. Check SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY and rebuild.",
    });
  }) as RequestHandler;
}

const app = express();
app.disable("x-powered-by");

// If behind a proxy (Railway/Fly/Render/etc.), cookies + IPs behave correctly.
app.set("trust proxy", true);

// -----------------------------
// CORS (browser -> LLM API)
// - Keep BEFORE any routes
// - Allows curl/server-to-server calls (no Origin header)
// -----------------------------
const corsOrigins = envList("CORS_ORIGINS", [
  "https://chuchube.co",
  "https://www.chuchube.co",
  "http://localhost:3000",
]);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow non-browser clients (curl, server-to-server)
      if (!origin) return cb(null, true);
      if (corsOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked origin: ${origin}`));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight
app.options("*", cors());

// CORS error -> JSON (instead of Express default HTML)
app.use(((err, _req, res, next) => {
  if (err && typeof err.message === "string" && err.message.startsWith("CORS blocked origin:")) {
    return res.status(403).json({ ok: false, error: err.message });
  }
  return next(err);
}) as any);

// Log every request (simple debug)
app.use((req, _res, next) => {
  console.log(`[req] ${req.method} ${req.url}`);
  next();
});

// JSON parser
app.use(express.json({ limit: "2mb" }));

// Handle invalid JSON bodies
app.use(((err, _req, res, next) => {
  if (err && (err as any).type === "entity.parse.failed") {
    return res.status(400).json({ ok: false, error: "Invalid JSON body" });
  }
  return next(err);
}) as any);

// -----------------------------
// Static assets (generated videos)
// apps/llm/assets -> served at /assets/*
// -----------------------------
const assetsDir = fileURLToPath(new URL("../assets/", import.meta.url));
const generatedDir = path.join(assetsDir, "generated");
await fs.mkdir(generatedDir, { recursive: true });

app.use(
  "/assets",
  express.static(assetsDir, {
    setHeaders: (res) => {
      // MP4s should be playable; avoid caching issues while iterating
      res.setHeader("Cache-Control", "no-store");
    },
  })
);

// -----------------------------
// Root ping
// -----------------------------
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "chuchube-llm", nowIso: new Date().toISOString() });
});

// -----------------------------
// RESEND email (REST, no SDK)
// -----------------------------
async function sendViaResend(args: {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("[llm] Missing RESEND_API_KEY");

  const from = args.from ?? process.env.RESEND_FROM;
  if (!from) throw new Error("[llm] Missing RESEND_FROM (e.g. 'Chuchube <no-reply@chuchube.co>')");

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 15000);

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: args.to,
        subject: args.subject,
        text: args.text,
        html: args.html,
        reply_to: args.replyTo,
      }),
      signal: controller.signal,
    });

    const json = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      const msg = (json as any)?.message || (json as any)?.error || `Resend error ${resp.status}`;
      throw new Error(msg);
    }

    return json as { id?: string };
  } finally {
    clearTimeout(t);
  }
}

async function getEmailViaResend(id: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("[llm] Missing RESEND_API_KEY");

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 15000);

  try {
    const resp = await fetch(`https://api.resend.com/emails/${encodeURIComponent(id)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    const json = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      const msg = (json as any)?.message || (json as any)?.error || `Resend error ${resp.status}`;
      throw new Error(msg);
    }

    return json;
  } finally {
    clearTimeout(t);
  }
}

/**
 * POST /v1/notify/email
 * Body: { to, subject, text?, html?, from?, replyTo? }
 */
app.post("/v1/notify/email", async (req, res) => {
  try {
    const to = req.body?.to;
    const subject = req.body?.subject;

    if (!to || !subject) {
      return res.status(400).json({ ok: false, error: "Missing 'to' or 'subject'" });
    }

    const text = typeof req.body?.text === "string" ? req.body.text : undefined;
    const html = typeof req.body?.html === "string" ? req.body.html : undefined;

    if (!text && !html) {
      return res.status(400).json({ ok: false, error: "Provide at least 'text' or 'html'" });
    }

    const from = typeof req.body?.from === "string" ? req.body.from : undefined;
    const replyTo = typeof req.body?.replyTo === "string" ? req.body.replyTo : undefined;

    const out = await sendViaResend({ to, subject, text, html, from, replyTo });

    return res.json({ ok: true, id: (out as any)?.id ?? null });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message ?? "Unknown error" });
  }
});

/**
 * GET /v1/notify/email/:id
 * Returns Resend email object including status fields (e.g. last_event).
 */
app.get("/v1/notify/email/:id", async (req, res) => {
  try {
    const id = req.params?.id;
    if (!id) {
      return res.status(400).json({ ok: false, error: "Missing email id" });
    }

    const email = await getEmailViaResend(id);
    return res.json({ ok: true, email });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message ?? "Unknown error" });
  }
});

// -----------------------------
// Mascot video via Veo (Vertex AI)
// -----------------------------

type TxSummary = { spend?: number; income?: number; net?: number };

const BASE_MASCOT_STYLE =
  "Duolingo-like finance mascot (round baby chick), relaxed confident stance, small satisfied smile, warm eyes, subtle sparkle, " +
  "holding a neat checklist and a coin jar, posture upright and composed, soft pastel gradient background, clean 2D vector, thick outline, minimal shading, " +
  "friendly mobile UI illustration. Keep the exact character identity and style consistent with the reference image.";

const MOTION_PRESETS: Record<string, { label: string; animate: string; vibe: string }> = {
  good: {
    label: "On track",
    vibe: "confident + calm",
    animate:
      "Animate: gentle idle breathing, blink twice, tiny head tilt, subtle sparkle twinkle, checklist bounce, coin jar wiggle. Smooth, cute, minimal motion.",
  },
  streak: {
    label: "Streak / winning",
    vibe: "happy + celebratory",
    animate:
      "Animate: happy bounce (small), quick blink, sparkle burst twinkle near head, checklist wiggle like a proud checkmark moment, coin jar tiny celebratory shake. Keep motion smooth and short.",
  },
  warning: {
    label: "Slightly off-track",
    vibe: "attentive + coaching",
    animate:
      "Animate: gentle breathing, one slow blink, small head tilt as if thinking, checklist taps once, coin jar subtle steady wobble. Calm and supportive (not sad).",
  },
  overspent: {
    label: "Overspent",
    vibe: "soft concern + encouragement",
    animate:
      "Animate: gentle breathing, slow blink, tiny head dip then recover to upright, checklist slightly droops then straightens, coin jar steadies. Keep it kind, not dramatic.",
  },
  neutral: {
    label: "Neutral",
    vibe: "idle",
    animate: "Animate: gentle idle breathing, single blink, micro head sway. Very subtle.",
  },
};

function pickPresetFromSummary(s?: TxSummary): keyof typeof MOTION_PRESETS {
  const spend = Number(s?.spend ?? 0);
  const income = Number(s?.income ?? 0);
  const net = Number(s?.net ?? income - spend);

  if (income > 0 && net > 0 && spend > 0) {
    if (net / Math.max(income, 1) > 0.25) return "streak";
    return "good";
  }
  if (spend > 0 && net < 0) return "overspent";
  if (spend > 0 && net >= 0) return "warning";
  return "neutral";
}

function buildMascotPrompt(args: { preset?: string; txSummary?: TxSummary; extra?: string }) {
  const chosen =
    (args.preset && (MOTION_PRESETS[args.preset] ? args.preset : undefined)) ??
    pickPresetFromSummary(args.txSummary);

  const preset = MOTION_PRESETS[chosen] ?? MOTION_PRESETS.neutral;

  const stats =
    args.txSummary
      ? `Context (numbers are real): spend=${args.txSummary.spend ?? 0}, income=${args.txSummary.income ?? 0}, net=${args.txSummary.net ?? Number(args.txSummary.income ?? 0) - Number(args.txSummary.spend ?? 0)}.`
      : "";

  const extra = args.extra ? `Extra instruction: ${args.extra}` : "";

  return [
    BASE_MASCOT_STYLE,
    preset.animate,
    "Duration: ~6–8 seconds. Keep background consistent. No text captions. No scene cuts.",
    stats,
    extra,
  ]
    .filter(Boolean)
    .join("\n");
}

function getVertexAccessToken(): string {
  // Prefer explicit token (for servers)
  const envTok = process.env.VERTEX_ACCESS_TOKEN;
  if (envTok && envTok.trim()) return envTok.trim();

  // Local dev fallback: gcloud
  try {
    const tok = execSync("gcloud auth print-access-token", { stdio: ["ignore", "pipe", "ignore"] })
      .toString("utf8")
      .trim();
    if (!tok) throw new Error("empty token");
    return tok;
  } catch {
    throw new Error(
      "[llm] Missing Vertex auth. Set VERTEX_ACCESS_TOKEN or run `gcloud auth login` and ensure gcloud is installed."
    );
  }
}

function vertexBase() {
  const projectId = process.env.VEO_PROJECT_ID || process.env.GCP_PROJECT_ID || process.env.PROJECT_ID;
  const location = process.env.VEO_LOCATION || process.env.LOCATION || "us-central1";
  const modelId = process.env.VEO_MODEL_ID || "veo-3.1-fast-generate-001";

  if (!projectId) {
    throw new Error("[llm] Missing VEO_PROJECT_ID (or GCP_PROJECT_ID / PROJECT_ID)");
  }

  const base =
    `https://${location}-aiplatform.googleapis.com/v1` +
    `/projects/${projectId}/locations/${location}/publishers/google/models/${modelId}`;

  return { projectId, location, modelId, base };
}

async function veoPredictLongRunning(args: { prompt: string; referenceGcsUri: string }) {
  const { base } = vertexBase();
  const accessToken = getVertexAccessToken();

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 30000);

  try {
    const resp = await fetch(`${base}:predictLongRunning`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        instances: [{ prompt: args.prompt }],
        parameters: {
          referenceImages: [
            {
              image: { gcsUri: args.referenceGcsUri },
              referenceType: "asset",
            },
          ],
        },
      }),
      signal: controller.signal,
    });

    const json = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      const msg = (json as any)?.error?.message || (json as any)?.message || `Vertex error ${resp.status}`;
      throw new Error(msg);
    }

    const opName = (json as any)?.name;
    if (!opName) throw new Error("Vertex did not return operation name");
    return opName as string;
  } finally {
    clearTimeout(t);
  }
}

async function veoFetchOperation(opName: string) {
  const { base } = vertexBase();
  const accessToken = getVertexAccessToken();

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 30000);

  try {
    const resp = await fetch(`${base}:fetchPredictOperation`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ operationName: opName }),
      signal: controller.signal,
    });

    const json = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      const msg = (json as any)?.error?.message || (json as any)?.message || `Vertex error ${resp.status}`;
      throw new Error(msg);
    }

    return json as any;
  } finally {
    clearTimeout(t);
  }
}

function extractVideoBase64(opJson: any): { b64: string; mimeType?: string } | null {
  const preds = opJson?.response?.predictions;
  if (Array.isArray(preds) && preds.length > 0) {
    const p0 = preds[0];
    const b64 = p0?.bytesBase64Encoded;
    const mimeType = p0?.mimeType;
    if (typeof b64 === "string" && b64.length > 1000) {
      return { b64, mimeType: typeof mimeType === "string" ? mimeType : undefined };
    }
  }

  // Fallback: deep scan for a large base64 blob
  const stack: any[] = [opJson];
  while (stack.length) {
    const cur = stack.pop();
    if (!cur) continue;

    if (typeof cur === "object") {
      for (const v of Object.values(cur)) {
        if (typeof v === "string" && v.length > 20000 && /^[A-Za-z0-9+/=]+$/.test(v)) {
          return { b64: v };
        }
        if (typeof v === "object") stack.push(v);
      }
    }
  }
  return null;
}

async function generateMascotVideoToAssets(args: {
  prompt: string;
  referenceGcsUri: string;
  outBasename?: string; // without extension
}) {
  const opName = await veoPredictLongRunning({
    prompt: args.prompt,
    referenceGcsUri: args.referenceGcsUri,
  });

  const maxAttempts = Number(process.env.VEO_POLL_MAX ?? 60); // 60 * 3s ~ 3 mins
  const intervalMs = Number(process.env.VEO_POLL_INTERVAL_MS ?? 3000);

  let last: any = null;

  for (let i = 0; i < maxAttempts; i++) {
    const op = await veoFetchOperation(opName);
    last = op;

    if (op?.done === true) {
      if (op?.error) {
        const msg = op?.error?.message || "Veo operation failed";
        throw new Error(msg);
      }

      const got = extractVideoBase64(op);
      if (!got) throw new Error("Veo returned done=true but no video bytes found");

      const buf = Buffer.from(got.b64, "base64");
      if (buf.length < 50_000) {
        throw new Error(`Video decode too small (${buf.length} bytes). Something went wrong.`);
      }

      const safeBase = (args.outBasename ?? `mascot_motion_${Date.now()}`)
        .replace(/[^a-zA-Z0-9._-]+/g, "_")
        .slice(0, 80);

      const outPath = path.join(generatedDir, `${safeBase}.mp4`);
      await fs.writeFile(outPath, buf);

      const fileName = path.basename(outPath);
      const publicUrl = `/assets/generated/${fileName}`;

      return {
        opName,
        filePath: outPath,
        fileName,
        publicUrl,
        bytes: buf.length,
        mimeType: got.mimeType ?? "video/mp4",
      };
    }

    await sleep(intervalMs);
  }

  throw new Error(
    `Timed out waiting for Veo operation after ${maxAttempts} attempts. Last response keys: ${Object.keys(last ?? {}).join(", ")}`
  );
}

/**
 * GET /v1/mascot/presets
 */
app.get("/v1/mascot/presets", (_req, res) => {
  const presets = Object.entries(MOTION_PRESETS).map(([key, v]) => ({
    key,
    label: v.label,
    vibe: v.vibe,
  }));
  res.json({ ok: true, presets });
});

/**
 * POST /v1/mascot/video
 * Body:
 * {
 *   preset?: "good"|"warning"|"overspent"|"streak"|"neutral",
 *   txSummary?: { spend?: number, income?: number, net?: number },
 *   extra?: string,
 *   refGcs?: string,
 *   outName?: string
 * }
 *
 * Saves MP4 under apps/llm/assets/generated and returns URL under /assets/generated/...
 */
app.post("/v1/mascot/video", async (req, res) => {
  try {
    const refGcs =
      (typeof req.body?.refGcs === "string" && req.body.refGcs.trim()) ||
      process.env.VEO_REF_GCS;

    if (!refGcs) {
      return res.status(400).json({
        ok: false,
        error: "Missing reference image. Provide body.refGcs or set VEO_REF_GCS=gs://.../mascot1.png",
      });
    }

    const preset = typeof req.body?.preset === "string" ? req.body.preset : undefined;
    const extra = typeof req.body?.extra === "string" ? req.body.extra : undefined;

    const txSummary: TxSummary | undefined =
      req.body?.txSummary && typeof req.body.txSummary === "object"
        ? {
            spend: req.body.txSummary.spend,
            income: req.body.txSummary.income,
            net: req.body.txSummary.net,
          }
        : undefined;

    const outName = typeof req.body?.outName === "string" ? req.body.outName : "mascot_motion_latest";

    const prompt = buildMascotPrompt({ preset, txSummary, extra });

    const out = await generateMascotVideoToAssets({
      prompt,
      referenceGcsUri: refGcs,
      outBasename: outName,
    });

    return res.json({
      ok: true,
      presetUsed: preset ?? pickPresetFromSummary(txSummary),
      refGcs,
      opName: out.opName,
      fileName: out.fileName,
      filePath: out.filePath,
      publicUrl: out.publicUrl,
      bytes: out.bytes,
      mimeType: out.mimeType,
    });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message ?? "Unknown error" });
  }
});

// -----------------------------
// Mount existing routers
// -----------------------------
app.use("/v1/health", healthRouter);
app.use("/v1/transactions", transactionsRouter);

// Simple 404 for anything else
app.use(
  ((req, res) => {
    res.status(404).json({ ok: false, error: "Not Found", path: req.path });
  }) as RequestHandler
);

// Final error handler -> JSON
app.use(((err, _req, res, _next) => {
  console.error("[llm] error", err);
  res.status(500).json({ ok: false, error: "Internal Server Error" });
}) as any);

const port = Number(process.env.PORT || 8080);

process.on("unhandledRejection", (err) => {
  console.error("[llm] unhandledRejection", err);
});

process.on("uncaughtException", (err) => {
  console.error("[llm] uncaughtException", err);
});

app.listen(port, () => {
  let veo = { projectId: "(unset)", location: "(unset)", modelId: "(unset)", base: "" };
  try {
    veo = vertexBase();
  } catch {
    // ignore
  }

  console.log(`[llm] listening on :${port}`);
  console.log(`[llm] GEMINI_API_KEY present? ${Boolean(process.env.GEMINI_API_KEY)}`);
  console.log(`[llm] RESEND_API_KEY present? ${Boolean(process.env.RESEND_API_KEY)}`);
  console.log(`[llm] CORS_ORIGINS: ${corsOrigins.join(", ")}`);
  console.log(`[llm] assetsDir: ${assetsDir}`);
  console.log(`[llm] generatedDir: ${generatedDir}`);
  console.log(`[llm] Veo config: project=${veo.projectId} location=${veo.location} model=${veo.modelId}`);
  console.log(`[llm] VEO_REF_GCS present? ${Boolean(process.env.VEO_REF_GCS)}`);
});
