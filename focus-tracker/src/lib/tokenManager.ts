let accessToken: string | null = null;
let refreshInFlight: Promise<string | null> | null = null;

const subscribers = new Set<(token: string | null) => void>();

function emitTokenChange(token: string | null) {
  subscribers.forEach((subscriber) => subscriber(token));
}

export function subscribeToTokenChanges(callback: (token: string | null) => void) {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  emitTokenChange(token);
}

export function clearAccessToken() {
  accessToken = null;
  emitTokenChange(null);
}

async function requestNewAccessToken(): Promise<string | null> {
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    clearAccessToken();
    return null;
  }

  const result = await response.json();
  const token = result?.accessToken || null;

  setAccessToken(token);
  return token;
}

export async function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = requestNewAccessToken().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}
