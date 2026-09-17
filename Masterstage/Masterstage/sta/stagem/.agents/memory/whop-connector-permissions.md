---
name: Whop connector access permissions
description: Constraint to check when using the connected Whop API for purchaser verification.
---

The connected Whop API key must be allowed to read the company’s customer/member access data before the app can map a verified Clerk email to a Whop purchaser.

**Why:** Plan and product lookups can succeed while customer or membership endpoints return provider authorization errors, causing a secure access check to fail closed.

**How to apply:** Verify member/customer access permissions on the Whop connection before enabling a server-side email-to-product entitlement check. Never replace the missing verification with checkout redirects, client state, or a success query parameter.