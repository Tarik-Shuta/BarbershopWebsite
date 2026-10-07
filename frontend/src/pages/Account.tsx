import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api, saveSession, type SessionUser } from "../lib/session.ts";

export default function Account() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

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
        token?: string;
        user?: SessionUser;
      };

      if (!response.ok || !result.token || !result.user) {
        setError(result.error ?? "Prijava nije uspjela.");
        return;
      }

      saveSession({
        token: result.token,
        user: result.user,
      });

      navigate(result.user.role === "BARBER" ? "/barber" : "/profile");
    } catch {
      setError("Nije moguće povezati se sa serverom.");
    }
  }

  function changeMode(newMode: "login" | "register") {
    setMode(newMode);
    setError("");
  }

  const input =
      "mt-1.5 w-full rounded-xl border border-white/10 bg-[#071c33]/80 " +
      "px-4 py-2.5 text-[15px] text-white placeholder:text-white/25 " +
      "outline-none transition-all duration-200 " +
      "hover:border-white/20 focus:border-cyan-300/70 " +
      "focus:bg-[#09213b] focus:ring-2 focus:ring-cyan-300/10";

  return (
      <section className="relative flex h-[calc(100svh-5rem)] items-center justify-center overflow-hidden bg-[#041426] px-5 text-white sm:px-8">
        {/* Background glow */}
        <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.06] blur-3xl"
        />

        <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-12rem] right-[-8rem] h-80 w-80 rounded-full bg-blue-500/[0.05] blur-3xl"
        />

        <div className="relative w-full max-w-md">
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] px-6 py-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:px-8 sm:py-7">
            {/* Header */}
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-300">
                Urban Barbershop
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight">
                {mode === "login"
                    ? "Dobrodošli nazad."
                    : "Kreirajte račun."}
              </h1>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-5 text-white/50">
                {mode === "login"
                    ? "Prijavite se i rezervišite svoj sljedeći termin."
                    : "Napravite račun i rezervišite termin u nekoliko koraka."}
              </p>
            </div>

            {/* Mode switch */}
            <div className="mx-auto mt-5 flex max-w-sm rounded-xl border border-white/[0.07] bg-[#03101f]/60 p-1">
              <button
                  type="button"
                  onClick={() => changeMode("login")}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      mode === "login"
                          ? "bg-[#0d386a] text-white shadow-sm"
                          : "text-white/40 hover:text-white/70"
                  }`}
              >
                Prijava
              </button>

              <button
                  type="button"
                  onClick={() => changeMode("register")}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      mode === "register"
                          ? "bg-[#0d386a] text-white shadow-sm"
                          : "text-white/40 hover:text-white/70"
                  }`}
              >
                Registracija
              </button>
            </div>

            {/* Form */}
            <form
                onSubmit={submit}
                className="mx-auto mt-5 max-w-sm space-y-3.5"
            >
              {mode === "register" && (
                  <>
                    <label className="block text-sm font-medium text-white/70">
                      Ime i prezime
                      <input
                          className={input}
                          name="name"
                          autoComplete="name"
                          minLength={2}
                          placeholder="Vaše ime i prezime"
                          required
                      />
                    </label>

                    <label className="block text-sm font-medium text-white/70">
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
                  </>
              )}

              <label className="block text-sm font-medium text-white/70">
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

              <label className="block text-sm font-medium text-white/70">
                Lozinka
                <input
                    className={input}
                    name="password"
                    type="password"
                    autoComplete={
                      mode === "login"
                          ? "current-password"
                          : "new-password"
                    }
                    minLength={8}
                    placeholder="••••••••"
                    required
                />
              </label>

              {error && (
                  <div
                      role="alert"
                      className="rounded-xl border border-rose-400/15 bg-rose-400/[0.07] px-4 py-2.5 text-sm text-rose-300"
                  >
                    {error}
                  </div>
              )}

              <button
                  type="submit"
                  className="w-full rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-[#041426] transition-all duration-200 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/10 active:scale-[0.99]"
              >
                {mode === "login"
                    ? "Prijavi se"
                    : "Napravi račun"}
              </button>
            </form>

            {/* Secondary switch */}
            <p className="mt-5 text-center text-sm text-white/40">
              {mode === "login"
                  ? "Još nemate račun?"
                  : "Već imate račun?"}{" "}
              <button
                  type="button"
                  onClick={() =>
                      changeMode(
                          mode === "login" ? "register" : "login"
                      )
                  }
                  className="font-medium text-cyan-300 transition-colors hover:text-cyan-200"
              >
                {mode === "login"
                    ? "Registrujte se"
                    : "Prijavite se"}
              </button>
            </p>
          </div>
        </div>
      </section>
  );
}
