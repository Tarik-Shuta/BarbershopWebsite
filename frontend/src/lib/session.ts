export type SessionUser = { id: string; name: string; email: string; phone: string; role: "CUSTOMER" | "BARBER"; barberName: string | null };
const apiUrl = (import.meta.env.VITE_API_URL ?? "http://localhost:3000").replace(/\/+$/, "");
export const getSession = () => {
  try { return JSON.parse(localStorage.getItem("urban-session") ?? "null") as { token: string; user: SessionUser } | null; }
  catch { return null; }
};
export const saveSession = (session: { token: string; user: SessionUser }) => localStorage.setItem("urban-session", JSON.stringify(session));
export const clearSession = () => localStorage.removeItem("urban-session");
export async function api(path: string, options: RequestInit = {}) {
  const session = getSession();
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  if (session) headers.set("Authorization", `Bearer ${session.token}`);
  return fetch(`${apiUrl}/api${path}`, { ...options, headers });
}
