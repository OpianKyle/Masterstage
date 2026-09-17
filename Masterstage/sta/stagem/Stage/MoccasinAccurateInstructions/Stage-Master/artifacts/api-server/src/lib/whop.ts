const WHOP_API_BASE_URL = "https://api.whop.com/api/v1";
const DEFAULT_API_VERSION_DATE = "2026-09-15";

type WhopMember = {
  user?: {
    id?: string;
    email?: string | null;
  };
  status?: "drafted" | "joined" | "left" | string;
  access_level?: "no_access" | "admin" | "customer" | string;
};

type WhopAccess = {
  has_access?: boolean;
  access_level?: "no_access" | "admin" | "customer" | string;
};

type WhopErrorBody = {
  error?: {
    message?: string;
    type?: string;
  } | null;
};

export type WhopAccessStatus =
  | "active"
  | "user_not_found"
  | "no_active_membership"
  | "missing_credentials"
  | "missing_configuration"
  | "invalid_credentials"
  | "insufficient_permissions"
  | "provider_unavailable";

export type PortalAccess = {
  configured: boolean;
  status: WhopAccessStatus;
  hasAccess: boolean;
  hasPersonalAccess: boolean;
  hasResellerAccess: boolean;
  accessTier: "personal" | "reseller" | null;
  accessLevel: string | null;
  error?: string;
};

class WhopApiError extends Error {
  constructor(
    readonly statusCode: number,
    readonly responseType?: string,
    message?: string,
  ) {
    super(message ?? `Whop request failed with status ${statusCode}`);
    this.name = "WhopApiError";
  }
}

function emptyAccess(
  configured: boolean,
  status: WhopAccessStatus,
  error?: string,
): PortalAccess {
  return {
    configured,
    status,
    hasAccess: false,
    hasPersonalAccess: false,
    hasResellerAccess: false,
    accessTier: null,
    accessLevel: null,
    ...(error ? { error } : {}),
  };
}

async function whopRequest<T>(path: string): Promise<T> {
  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey) {
    throw new Error("WHOP_API_KEY is not configured.");
  }

  let response: Response;
  try {
    response = await fetch(`${WHOP_API_BASE_URL}${path}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Api-Version-Date":
          process.env.WHOP_API_VERSION_DATE ?? DEFAULT_API_VERSION_DATE,
      },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    throw new WhopApiError(
      503,
      undefined,
      error instanceof Error ? error.message : "Whop request failed.",
    );
  }

  if (!response.ok) {
    let body: WhopErrorBody = {};
    try {
      body = (await response.json()) as WhopErrorBody;
    } catch {
      // Keep the HTTP status as the useful error when Whop returns no JSON.
    }
    throw new WhopApiError(
      response.status,
      body.error?.type,
      body.error?.message,
    );
  }

  return (await response.json()) as T;
}

function statusForWhopError(error: unknown): WhopAccessStatus {
  if (!(error instanceof WhopApiError)) return "provider_unavailable";
  if (error.statusCode === 401) return "invalid_credentials";
  if (error.statusCode === 403) return "insufficient_permissions";
  if (error.statusCode === 429 || error.statusCode >= 500) {
    return "provider_unavailable";
  }
  return "provider_unavailable";
}

export function isWhopSystemError(status: WhopAccessStatus) {
  return (
    status === "missing_credentials" ||
    status === "missing_configuration" ||
    status === "invalid_credentials" ||
    status === "insufficient_permissions" ||
    status === "provider_unavailable"
  );
}

export async function checkWhopAccess(email: string): Promise<PortalAccess> {
  const apiKey = process.env.WHOP_API_KEY;
  const companyId = process.env.WHOP_COMPANY_ID;
  const personalProductId = process.env.WHOP_PERSONAL_PRODUCT_ID;
  const resellerProductId = process.env.WHOP_RESELLER_PRODUCT_ID;

  if (!apiKey) {
    return emptyAccess(
      false,
      "missing_credentials",
      "Whop API credentials are not configured.",
    );
  }
  if (!companyId || !personalProductId || !resellerProductId) {
    return emptyAccess(
      false,
      "missing_configuration",
      "Whop company and product configuration is incomplete.",
    );
  }

  try {
    const members = await whopRequest<{ data?: WhopMember[] }>(
      `/members?account_id=${encodeURIComponent(companyId)}&query=${encodeURIComponent(email)}&first=10`,
    );
    const normalizedEmail = email.toLowerCase();
    const member = members.data?.find(
      (candidate) => candidate.user?.email?.toLowerCase() === normalizedEmail,
    );
    const whopUserId = member?.user?.id;

    if (!whopUserId) {
      return emptyAccess(true, "user_not_found");
    }

    const [personalAccess, resellerAccess] = await Promise.all([
      whopRequest<WhopAccess>(
        `/users/${encodeURIComponent(whopUserId)}/access/${encodeURIComponent(personalProductId)}`,
      ),
      whopRequest<WhopAccess>(
        `/users/${encodeURIComponent(whopUserId)}/access/${encodeURIComponent(resellerProductId)}`,
      ),
    ]);
    const hasPersonalAccess = personalAccess.has_access === true;
    const hasResellerAccess = resellerAccess.has_access === true;
    const accessTier = hasResellerAccess
      ? "reseller"
      : hasPersonalAccess
        ? "personal"
        : null;

    return {
      configured: true,
      status: accessTier ? "active" : "no_active_membership",
      hasAccess: hasPersonalAccess || hasResellerAccess,
      hasPersonalAccess,
      hasResellerAccess,
      accessTier,
      accessLevel:
        (hasResellerAccess
          ? resellerAccess.access_level
          : personalAccess.access_level) ?? null,
    };
  } catch (error) {
    const status = statusForWhopError(error);
    console.error("Whop access verification failed", {
      status,
      error: error instanceof Error ? error.message : error,
    });
    return emptyAccess(
      true,
      status,
      status === "invalid_credentials"
        ? "The Whop API key is invalid."
        : status === "insufficient_permissions"
          ? "The Whop API key does not have the required member permissions."
          : "Whop is temporarily unavailable.",
    );
  }
}