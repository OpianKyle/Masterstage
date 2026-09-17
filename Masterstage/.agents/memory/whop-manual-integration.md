---
name: Manual Whop verification
description: Constraints for verifying Whop membership access without the managed connector.
---

Use the Whop API from the server only. List company members using the member basic and email read permissions, identify the authenticated user's Whop ID, then check access against each configured product. Treat missing credentials, invalid credentials, insufficient permissions, provider outages, missing users, and inactive memberships as separate states. Whop's dashboard labels "Read members" and "Read member emails" must be attached to the exact Company API key stored in Replit; changing another key does not change the runtime authorization.

**Why:** A valid-looking API key can still return 403 until the required member permissions are granted, and collapsing that response into "no access" hides a configuration problem.

**How to apply:** Keep the key in Replit Secrets, never expose it to the browser or chat, and verify the member endpoint before testing Personal and Reseller access.