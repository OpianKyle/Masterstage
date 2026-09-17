---
name: Whop access gate
description: Constraints for granting StageMaster portal access from Whop.
---

The member portal must grant access only after the server verifies the signed-in Clerk user against a configured Whop product. Never unlock based only on a checkout redirect, query parameter, client state, or email match without a successful Whop access response.

**Why:** The connected Whop account may authenticate successfully while lacking permission to list the company or products, and the portal must not turn that configuration gap into free access.

**How to apply:** Keep the access endpoint fail-closed when the product resource or Whop permissions are unavailable; configure the product resource only after the connected Whop account exposes the correct product and access scope.

The Replit Whop connector can report healthy while its API key still lacks `company:basic:read`; this is an API-key permission issue, not an OAuth reconnect issue.

**Why:** A healthy connection status does not guarantee the key can enumerate the company or products needed to configure the portal.

**How to apply:** When Whop returns a structured missing-permission error, have the owner update the existing Whop key/connection permissions rather than retrying OAuth or guessing a product ID.