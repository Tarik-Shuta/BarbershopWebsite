import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, saveSession, type SessionUser } from "../lib/session.ts";

export default function Account() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await api(`/auth/${mode === "login" ? "login" : "register"}`, { method: "POST", body: JSON.stringify(payload) });
      const result = await response.json() as { error?: string; token?: string; user?: SessionUser };
      if (!response.ok || !result.token || !result.user) { setError(result.error ?? "Could not sign in"); return; }
      saveSession({ token: result.token, user: result.user });
      navigate(result.user.role === "BARBER" ? "/barber" : "/book");
    } catch { setError("Could not connect to the server"); }
  }
  const input = "mt-2 w-full rounded-lg border border-white/15 bg-[#071c33] px-4 py-3 text-white outline-none focus:border-cyan-300";
  return <section className="min-h-[calc(100svh-5rem)] bg-[#041426] px-5 py-12 text-white sm:px-8 sm:py-16"><div className="mx-auto max-w-xl">
    <Link to="/" className="text-sm text-cyan-300">← Početna</Link>
    <p className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Urban Barbershop</p>
    <h1 className="mt-3 text-4xl font-bold">{mode === "login" ? "Prijava" : "Registracija"}</h1>
    <p className="mt-2 text-white/60">{mode === "login" ? "Prijavite se da rezervišete termin." : "Napravite korisnički račun za rezervacije."}</p>
    <form onSubmit={submit} className="mt-8 space-y-5">
      {mode === "register" && <>
        <label className="block text-sm text-white/80">Ime i prezime<input className={input} name="name" autoComplete="name" minLength={2} required /></label>
        <label className="block text-sm text-white/80">Telefon<input className={input} name="phone" type="tel" autoComplete="tel" minLength={6} required /></label>
      </>}
      <label className="block text-sm text-white/80">Email<input className={input} name="email" type="email" autoComplete="email" required /></label>
      <label className="block text-sm text-white/80">Lozinka<input className={input} name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} required /></label>
      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      <button className="rounded-full bg-cyan-400 px-7 py-3 font-semibold text-[#071c33]">{mode === "login" ? "Prijavi se" : "Napravi račun"}</button>
    </form>
    <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} className="mt-5 block text-sm text-cyan-300">{mode === "login" ? "Nemate račun? Registrujte se" : "Već imate račun? Prijavite se"}</button>
  </div></section>;
}
