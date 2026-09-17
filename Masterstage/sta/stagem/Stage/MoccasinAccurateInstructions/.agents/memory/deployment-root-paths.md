---
name: Deployment root paths
description: Publishing for the nested Stage Master artifact starts from the outer project root, not the workspace parent.
---

Replit publishing already runs from the outer `Stage-Master` project directory. Deployment build commands and public directories must be relative to that root; adding `cd Stage-Master` enters the duplicate nested clone and can trigger stale workspace builds.

**Why:** Failed publish attempts showed the website building from the outer artifact path while the extra command entered `Stage-Master/Stage-Master` and ran an outdated API workspace.

**How to apply:** Use the site filter directly, such as `pnpm --filter @workspace/stage-master run build`, and use `artifacts/stage-master/dist/public` as the static output path.