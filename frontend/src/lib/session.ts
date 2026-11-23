export type SessionUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "CUSTOMER" | "BARBER";
  barberName: string | null;
};

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const apiUrl = (configuredApiUrl || (import.meta.env.DEV ? "http://localhost:3000" : ""))
  .replace(/\/+$/, "")
  .replace(/\/api$/i, "");

type Session = { user: SessionUser };

function readStoredSession(): Session | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const stored = JSON.parse(localStorage.getItem("urban-session") ?? "null") as
      | { user?: SessionUser; token?: string }
      | null;
    if (!stored?.user) return null;
    if (stored.token) localStorage.setItem("urban-session", JSON.stringify({ user: stored.user }));
    return { user: stored.user };
  } catch {
    return null;
  }
}

let sessionSnapshot = readStoredSession();
const sessionListeners = new Set<() => void>();

function notifySessionChange() {
  sessionListeners.forEach((listener) => listener());
}

export const getSession = () => sessionSnapshot;

export const subscribeToSession = (listener: () => void) => {
  sessionListeners.add(listener);
  return () => sessionListeners.delete(listener);
};

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "urban-session") {
      sessionSnapshot = readStoredSession();
      notifySessionChange();
    }
  });
}

export const saveSession = (user: SessionUser) => {
  localStorage.setItem("urban-session", JSON.stringify({ user }));
  sessionSnapshot = { user };
  notifySessionChange();
};

export const clearSession = () => {
  localStorage.removeItem("urban-session");
  sessionSnapshot = null;
  notifySessionChange();
};

export async function api(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);

  if (!apiUrl && import.meta.env.PROD) {
    throw new Error("VITE_API_URL is not configured for this frontend deployment");
  }
  if (options.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${apiUrl}/api${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
  if (response.status === 401) clearSession();
  return response;
}

export async function logout() {
  try {
    await api("/auth/logout", { method: "POST" });
  } finally {
    clearSession();
  }
}
