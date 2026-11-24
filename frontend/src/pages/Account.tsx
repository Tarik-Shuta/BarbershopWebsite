import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api, saveSession, type SessionUser } from "../lib/session.ts";

export default function Account() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setError("");
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const response = await api(
          `/auth/${mode === "login" ? "login" : "register"}`,
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
      );

      const result = (await response.json()) as {
        error?: string;
        user?: SessionUser;
      };

      if (!response.ok || !result.user) {
        setError(result.error ?? "Prijava nije uspjela.");
        return;
      }

      saveSession(result.user);

      navigate(result.user.role === "BARBER" ? "/barber" : "/profile");
    } catch {
      setError("Nije moguće povezati se sa serverom.");
    } finally {
      setSubmitting(false);
    }
  }

  function changeMode(newMode: "login" | "register") {
    setMode(newMode);
    setError("");
  }

  const input =
      "mt-1 w-full rounded-lg border border-white/10 bg-[#071c33]/80 " +
      "px-3.5 py-2 text-sm text-white placeholder:text-white/25 " +
      "outline-none transition-all duration-200 " +
      "hover:border-white/20 focus:border-cyan-300/70 " +
      "focus:bg-[#09213b] focus:ring-2 focus:ring-cyan-300/10";

  const label = "block text-[13px] font-medium text-white/70";

  const tab = (active: boolean) =>
      `flex-1 rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
          active
              ? "bg-[#0d386a] text-white shadow-sm"
              : "text-white/40 hover:text-white/70"
      }`;

  return (
      <section className="relative flex min-h-[calc(100svh-5rem)] items-center justify-center overflow-hidden bg-[#041426] px-4 py-6 text-white sm:px-8">
        <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-112 w-md -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/6 blur-3xl"
        />

        <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-48 -right-32 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl"
        />

        {/* Wide, short card: brand panel on the left, form on the right */}
        <div className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/2.5 shadow-2xl shadow-black/20 backdrop-blur-sm md:flex-row">
          {/* Barber-pole stripe */}
          <div
              aria-hidden="true"
              className="h-1.5 shrink-0 opacity-80 md:h-auto md:w-1.5"
              style={{
                backgroundImage:
                    "repeating-linear-gradient(135deg, #22d3ee 0 10px, #f8fafc 10px 20px, #1d4ed8 20px 30px)",
              }}
          />

          {/* Brand panel */}
          <div className="flex flex-col justify-center bg-[#06223f]/70 px-5 py-4 md:w-2/5 md:px-8 md:py-8">
            <p className="text-sm font-bold tracking-wide text-cyan-300">
              Urban Barbershop
            </p>

            <h1 className="mt-1 text-sm font-bold tracking-tight md:mt-3 md:text-md-xl">
              {mode === "login" ? "Dobrodošli nazad" : "Kreirajte račun"}
            </h1>

            <p className="mt-3 hidden text-sm leading-relaxed text-white/50 md:block">
              {mode === "login"
                  ? "Prijavite se da zakažete termin i pratite svoje rezervacije."
                  : "Napravite račun i zakažite termin za nekoliko klikova."}
            </p>
          </div>

          {/* Form panel */}
          <div className="flex-1 px-5 py-5 md:px-8 md:py-7">
            <div
                role="tablist"
                className="flex rounded-lg border border-white/[0.07] bg-[#03101f]/60 p-1"
            >
              <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "login"}
                  onClick={() => changeMode("login")}
                  className={tab(mode === "login")}
              >
                Prijava
              </button>

              <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "register"}
                  onClick={() => changeMode("register")}
                  className={tab(mode === "register")}
              >
                Registracija
              </button>
            </div>

            <form onSubmit={submit} className="mt-4 space-y-3">
              {mode === "register" ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className={label}>
                      Ime i prezime
                      <input
                          className={input}
                          name="name"
                          autoComplete="name"
                          minLength={2}
                          placeholder="Ime i prezime"
                          required
                      />
                    </label>

                    <label className={label}>
                      Telefon
                      <input
                          className={input}
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          minLength={6}
                          placeholder="+387 61 123 456"
                          required
                      />
                    </label>

                    <label className={label}>
                      Email
                      <input
                          className={input}
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="ime@email.com"
                          required
                      />
                    </label>

                    <label className={label}>
                      Lozinka
                      <input
                          className={input}
                          name="password"
                          type="password"
                          autoComplete="new-password"
                          minLength={8}
                          placeholder="Najmanje 8 znakova"
                          required
                      />
                    </label>
                  </div>
              ) : (
                  <>
                    <label className={label}>
                      Email
                      <input
                          className={input}
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="ime@email.com"
                          required
                      />
                    </label>

                    <label className={label}>
                      Lozinka
                      <input
                          className={input}
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          minLength={8}
                          placeholder="••••••••"
                          required
                      />
                    </label>
                  </>
              )}

              {error && (
                  <div
                      role="alert"
                      className="rounded-lg border border-rose-400/15 bg-rose-400/[0.07] px-3.5 py-2 text-[13px] text-rose-300"
                  >
                    {error}
                  </div>
              )}

              <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-cyan-400 px-5 py-2.5 text-sm font-bold text-[#041426] transition-all duration-200 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/10 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                    ? "Molimo sačekajte…"
                    : mode === "login"
                        ? "Prijavi se"
                        : "Napravi račun"}
              </button>
            </form>
          </div>
        </div>
      </section>
  );
}