---
name: Protected member content
description: Rules for keeping paid StageMaster assets and lesson text behind the server-side access gate.
---

Paid member content must not be bundled into the public frontend, even when the portal UI hides it. Keep paid videos, downloads, and full lesson text outside public static assets and require Clerk authentication plus a fresh Whop access check on every protected API request.

**Why:** Frontend bundles are downloadable by unauthenticated visitors, and browser state or hidden UI cannot enforce access.

**How to apply:** Add new paid assets to the server-side allowlist and serve them through authenticated API routes. Keep only non-sensitive course metadata in the frontend bundle.

Development UX testing may use an explicit preview flag only when the server is not running in production; it must still require a Clerk-authenticated user and must be visibly labeled as a preview.

**Why:** The owner needs to test the full member experience before Whop product permissions are repaired, without creating a production access bypass.

**How to apply:** Keep the preview flag in the development environment only, and never let it override access checks when `NODE_ENV` is production.