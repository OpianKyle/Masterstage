import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Router, type Request, type Response } from "express";
import { clerkClient, getAuth } from "@clerk/express";
import {
  checkWhopAccess,
  isWhopSystemError,
  type PortalAccess,
} from "../lib/whop";
import { getProtectedAssetPath } from "../lib/protected-assets";
import { protectedLessons } from "../lib/protected-lessons";

const router = Router();

async function getVerifiedEmail(userId: string): Promise<string> {
  const user = await clerkClient.users.getUser(userId);
  const primaryEmail = user.primaryEmailAddress;
  if (!primaryEmail || primaryEmail.verification?.status !== "verified") {
    throw new Error("A verified email is required to confirm Whop access.");
  }
  return primaryEmail.emailAddress;
}

function isPortalPreviewEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.PORTAL_PREVIEW_MODE === "true";
}

async function getPortalAccess(email: string) {
  return checkWhopAccess(email);
}

function sendWhopSystemError(res: Response, access: PortalAccess) {
  res.status(503).json({
    code: `whop_${access.status}`,
    error: access.error ?? "Whop access verification is unavailable.",
    configured: access.configured,
  });
}

function canAccessAsset(
  accessTier: "personal" | "reseller" | null,
  requiredTier: "personal" | "reseller",
) {
  return accessTier === "reseller" || (requiredTier === "personal" && accessTier === "personal");
}

router.get("/access", async (req: Request, res: Response) => {
  const auth = getAuth(req);
  if (!auth.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    let email: string;
    try {
      email = await getVerifiedEmail(auth.userId);
    } catch {
      res.status(403).json({
        error: "A verified email is required to confirm Whop access.",
      });
      return;
    }

    const access = await getPortalAccess(email);
    if (isWhopSystemError(access.status)) {
      sendWhopSystemError(res, access);
      return;
    }
    res.json({
      userId: auth.userId,
      status: access.status,
      hasAccess: access.hasAccess,
      hasPersonalAccess: access.hasPersonalAccess,
      hasResellerAccess: access.hasResellerAccess,
      accessTier: access.accessTier,
      accessLevel: access.accessLevel,
      configured: access.configured,
      preview: isPortalPreviewEnabled(),
    });
  } catch (error) {
    console.error("Portal access route failed", error);
    res.status(500).json({ error: "Unable to verify access right now." });
  }
});

router.get("/lessons", async (req: Request, res: Response) => {
  const auth = getAuth(req);
  if (!auth.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const email = await getVerifiedEmail(auth.userId);
    const access = await getPortalAccess(email);
    if (isWhopSystemError(access.status)) {
      sendWhopSystemError(res, access);
      return;
    }
    if (!access.hasAccess) {
      res.status(403).json({ error: "Whop access is required." });
      return;
    }
    res.setHeader("Cache-Control", "private, no-store");
    res.json({ lessons: protectedLessons });
  } catch (error) {
    if (error instanceof Error && error.message.includes("verified email")) {
      res.status(403).json({ error: error.message });
      return;
    }
    console.error("Protected lesson request failed", error);
    res.status(503).json({ error: "Lessons are unavailable right now." });
  }
});

router.get("/content/:assetId", async (req: Request, res: Response) => {
  const auth = getAuth(req);
  if (!auth.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const email = await getVerifiedEmail(auth.userId);
    const access = await getPortalAccess(email);

    if (isWhopSystemError(access.status)) {
      sendWhopSystemError(res, access);
      return;
    }

    if (!access.hasAccess) {
      res.status(403).json({ error: "Whop access is required." });
      return;
    }

    const assetId = Array.isArray(req.params.assetId)
      ? req.params.assetId[0]
      : req.params.assetId;
    const resolved = getProtectedAssetPath(assetId);
    if (!resolved) {
      res.status(404).json({ error: "Content not found." });
      return;
    }
    if (!canAccessAsset(access.accessTier, resolved.asset.requiredTier)) {
      res.status(403).json({
        error: "Reseller Rights access is required for this download.",
      });
      return;
    }

    const fileInfo = await stat(resolved.filePath);
    const range = req.headers.range;
    const isVideo = resolved.asset.contentType.startsWith("video/");

    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Type", resolved.asset.contentType);
    res.setHeader(
      "Content-Disposition",
      `${resolved.asset.disposition}; filename="${resolved.asset.downloadName}"`,
    );

    if (isVideo && range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match) {
        res.status(416).setHeader("Content-Range", `bytes */${fileInfo.size}`).end();
        return;
      }

      const start = match[1] ? Number(match[1]) : 0;
      const requestedEnd = match[2] ? Number(match[2]) : fileInfo.size - 1;
      const end = Math.min(requestedEnd, fileInfo.size - 1);

      if (start >= fileInfo.size || start > end) {
        res.status(416).setHeader("Content-Range", `bytes */${fileInfo.size}`).end();
        return;
      }

      res.status(206);
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Content-Range", `bytes ${start}-${end}/${fileInfo.size}`);
      res.setHeader("Content-Length", end - start + 1);
      createReadStream(resolved.filePath, { start, end }).pipe(res);
      return;
    }

    res.setHeader("Content-Length", fileInfo.size);
    if (isVideo) res.setHeader("Accept-Ranges", "bytes");
    createReadStream(resolved.filePath).pipe(res);
  } catch (error) {
    if (error instanceof Error && error.message.includes("verified email")) {
      res.status(403).json({ error: error.message });
      return;
    }
    console.error("Protected portal content request failed", error);
    res.status(404).json({ error: "Content is unavailable." });
  }
});

export default router;