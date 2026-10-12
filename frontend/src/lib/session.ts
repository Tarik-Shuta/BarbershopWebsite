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

export const getSession = () => {
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
};

export const saveSession = (user: SessionUser) => {
  localStorage.setItem("urban-session", JSON.stringify({ user }));
};

export const clearSession = () => {
  localStorage.removeItem("urban-session");
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
