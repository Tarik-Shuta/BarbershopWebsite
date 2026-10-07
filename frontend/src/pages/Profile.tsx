import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, getSession } from "../lib/session.ts";

type Booking = {
  id: string;
  barber: string;
  service: string;
  startsAt: string;
  status: "PENDING" | "CONFIRMED" | "DECLINED";
};

const dateTime = new Intl.DateTimeFormat("bs-BA", {
  dateStyle: "medium",
  timeStyle: "short",
});

const statusLabels: Record<Booking["status"], string> = {
  PENDING: "Na čekanju",
  CONFIRMED: "Potvrđen",
  DECLINED: "Odbijen",
};

export default function Profile() {
  const session = getSession();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) {
      navigate("/account", { replace: true });
      return;
    }
    if (session.user.role === "BARBER") {
      navigate("/barber", { replace: true });
      return;
    }

    void api("/bookings/mine")
      .then(async (response) => {
        const result = await response.json() as { error?: string; bookings?: Booking[] };
        if (!response.ok) throw new Error(result.error ?? "Profil trenutno nije moguće učitati.");
        setBookings(result.bookings ?? []);
      })
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : "Profil trenutno nije moguće učitati.");
      })
      .finally(() => setLoading(false));
  }, [navigate, session?.user.role]);

  if (!session || session.user.role === "BARBER") return null;

  const now = Date.now();
  const pastHaircuts = bookings
    .filter((booking) => booking.status === "CONFIRMED" && new Date(booking.startsAt).getTime() <= now)
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());
  const upcoming = bookings
    .filter((booking) => booking.status !== "DECLINED" && new Date(booking.startsAt).getTime() > now)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  return (
    <section className="min-h-[calc(100svh-5rem)] bg-[#041426] px-5 py-12 text-white sm:px-8 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Urban Barbershop</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Moj profil</h1>

        <section aria-labelledby="account-heading" className="mt-9 border-y border-white/10 py-6">
          <h2 id="account-heading" className="text-lg font-semibold">Podaci računa</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><dt className="text-sm text-white/50">Ime i prezime</dt><dd className="mt-1">{session.user.name}</dd></div>
            <div><dt className="text-sm text-white/50">Email</dt><dd className="mt-1 break-all">{session.user.email}</dd></div>
            <div><dt className="text-sm text-white/50">Telefon</dt><dd className="mt-1">{session.user.phone}</dd></div>
          </dl>
        </section>

        {error && <p role="alert" className="mt-6 rounded-lg border border-rose-300/20 bg-rose-300/5 p-4 text-sm text-rose-200">{error}</p>}

        <section aria-labelledby="upcoming-heading" className="mt-9">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="upcoming-heading" className="text-xl font-semibold">Naredni termini</h2>
            <Link to="/book" className="text-sm font-medium text-cyan-300 hover:text-cyan-200">Zakaži termin</Link>
          </div>
          {loading ? <p className="mt-4 text-sm text-white/55">Učitavanje termina…</p> : upcoming.length ? (
            <div className="mt-4 divide-y divide-white/10 border-y border-white/10">
              {upcoming.map((booking) => (
                <article key={booking.id} className="flex flex-wrap items-center justify-between gap-2 py-4">
                  <div><p className="font-medium">{booking.service}</p><p className="mt-1 text-sm text-white/55">{dateTime.format(new Date(booking.startsAt))} · {booking.barber}</p></div>
                  <span className="text-sm text-cyan-200">{statusLabels[booking.status]}</span>
                </article>
              ))}
            </div>
          ) : <p className="mt-4 text-sm text-white/55">Nemate zakazanih termina.</p>}
        </section>

        <section aria-labelledby="history-heading" className="mt-10">
          <h2 id="history-heading" className="text-xl font-semibold">Prethodna šišanja</h2>
          {loading ? <p className="mt-4 text-sm text-white/55">Učitavanje historije…</p> : pastHaircuts.length ? (
            <div className="mt-4 divide-y divide-white/10 border-y border-white/10">
              {pastHaircuts.map((booking) => (
                <article key={booking.id} className="flex flex-wrap items-center justify-between gap-2 py-4">
                  <div><p className="font-medium">{booking.service}</p><p className="mt-1 text-sm text-white/55">{dateTime.format(new Date(booking.startsAt))} · {booking.barber}</p></div>
                  <span className="text-sm text-white/45">Završeno</span>
                </article>
              ))}
            </div>
          ) : <p className="mt-4 text-sm text-white/55">Još nema prethodnih šišanja.</p>}
        </section>
      </div>
    </section>
  );
}
