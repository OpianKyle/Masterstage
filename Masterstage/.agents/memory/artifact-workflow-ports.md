---
name: Artifact workflow ports
description: Replit workflow behavior encountered when a project contains generated artifacts.
---

Generated artifact workflows may be managed and cannot be removed through the workflow API. If one of them runs the same backend on the port needed by a custom workflow, stop the managed duplicate before restarting the custom service.

**Why:** Two API server workflows on port 8080 caused a false startup failure even though the application build was healthy.

**How to apply:** Check all workflow states and open ports before diagnosing an address-in-use error as an application problem.