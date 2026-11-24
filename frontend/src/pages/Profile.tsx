import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
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

const dayFormat = new Intl.DateTimeFormat("bs-BA", { day: "numeric" });
const monthFormat = new Intl.DateTimeFormat("bs-BA", { month: "short" });

const statusLabels: Record<Booking["status"], string> = {
  PENDING: "Na čekanju",
  CONFIRMED: "Potvrđen",
  DECLINED: "Odbijen",
};

const statusStyles: Record<Booking["status"], string> = {
  PENDING: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  CONFIRMED: "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
  DECLINED: "border-rose-300/25 bg-rose-300/10 text-rose-200",
};

const card =
    "rounded-2xl border border-white/8 bg-white/2.5 shadow-2xl shadow-black/20 backdrop-blur-sm";

function BookingRow({ booking, past }: { booking: Booking; past?: boolean }) {
  const date = new Date(booking.startsAt);

  return (
      <article className="flex items-center gap-4 py-3.5">
        <div
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-[#071c33]/80 leading-none"
        >
          <span className="text-lg font-bold">{dayFormat.format(date)}</span>
          <span className="mt-1 text-[11px] text-white/50">{monthFormat.format(date)}</span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-medium">{booking.service}</p>
          <p className="mt-0.5 text-sm text-white/55">
            {dateTime.format(date)} · {booking.barber}
          </p>
        </div>

        <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${
                past ? "border-white/10 bg-white/5 text-white/50" : statusStyles[booking.status]
            }`}
        >
        {past ? "Završeno" : statusLabels[booking.status]}
      </span>
      </article>
  );
}

function ListCard({
                    id,
                    title,
                    count,
                    children,
                  }: {
  id: string;
  title: string;
  count?: number;
  children: ReactNode;
}) {
  return (
      <section aria-labelledby={id} className={`${card} flex flex-col p-5`}>
        <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-3">
          <h2 id={id} className="text-lg font-semibold">{title}</h2>
          {count !== undefined && (
              <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      count > 0 ? "bg-cyan-400/15 text-cyan-200" : "bg-white/5 text-white/40"
                  }`}
              >
            {count}
          </span>
          )}
        </div>
        {children}
      </section>
  );
}

function Message({ children }: { children: ReactNode }) {
  return (
      <p className="flex flex-1 items-center justify-center px-4 py-10 text-center text-sm text-white/55">
        {children}
      </p>
  );
}

export default function Profile() {
  const session = getSession();
  const userId = session?.user.id;
  const userRole = session?.user.role;
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now] = useState(() => Date.now());

  useEffect(() => {
    if (!userId) {
      navigate("/account", { replace: true });
      return;
    }
    if (userRole === "BARBER") {
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
  }, [navigate, userId, userRole]);

  if (!session || session.user.role === "BARBER") return null;

  const pastHaircuts = bookings
      .filter((booking) => booking.status === "CONFIRMED" && new Date(booking.startsAt).getTime() <= now)
      .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());
  const upcoming = bookings
      .filter((booking) => booking.status !== "DECLINED" && new Date(booking.startsAt).getTime() > now)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  const initials = session.user.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");

  return (
      <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-[#041426] px-4 py-8 text-white sm:px-8 sm:py-10">
        <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-112 w-md -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/6 blur-3xl"
        />
        <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-48 -right-32 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl"
        />

        <div className="relative mx-auto max-w-4xl space-y-5">
          {/* Profile */}
          <div className={`${card} px-6 pt-7`}>
            <div className="flex flex-col items-center text-center">
              <div
                  aria-hidden="true"
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/30 bg-[#0d386a] text-xl font-bold text-cyan-200 ring-8 ring-cyan-300/5"
              >
                {initials}
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                <span className="sr-only">Moj profil: </span>
                {session.user.name}
              </h1>
            </div>

            <dl className="mt-6 grid border-t border-white/8 sm:grid-cols-2">
              <div className="py-4 text-center sm:border-r sm:border-white/8">
                <dt className="text-xs text-white/45">Email</dt>
                <dd className="mt-0.5 break-all text-sm">{session.user.email}</dd>
              </div>
              <div className="border-t border-white/8 py-4 text-center sm:border-t-0">
                <dt className="text-xs text-white/45">Telefon</dt>
                <dd className="mt-0.5 text-sm">{session.user.phone}</dd>
              </div>
            </dl>
          </div>

          {error && (
              <p
                  role="alert"
                  className="rounded-lg border border-rose-300/20 bg-rose-300/5 p-4 text-center text-sm text-rose-200"
              >
                {error}
              </p>
          )}

          {/* Two equal columns */}
          <div className="grid gap-5 md:grid-cols-2">
            <ListCard
                id="upcoming-heading"
                title="Naredni termini"
                count={loading ? undefined : upcoming.length}
            >
              {loading ? (
                  <Message>Učitavanje termina…</Message>
              ) : upcoming.length ? (
                  <div className="max-h-[26rem] divide-y divide-white/8 overflow-y-auto pr-1 [color-scheme:dark]">
                    {upcoming.map((booking) => (
                        <BookingRow key={booking.id} booking={booking} />
                    ))}
                  </div>
              ) : (
                  <Message>Nemate zakazanih termina.</Message>
              )}
            </ListCard>

            <ListCard
                id="history-heading"
                title="Prethodna šišanja"
                count={loading ? undefined : pastHaircuts.length}
            >
              {loading ? (
                  <Message>Učitavanje historije…</Message>
              ) : pastHaircuts.length ? (
                  <div className="max-h-[26rem] divide-y divide-white/8 overflow-y-auto pr-1 [color-scheme:dark]">
                    {pastHaircuts.map((booking) => (
                        <BookingRow key={booking.id} booking={booking} past />
                    ))}
                  </div>
              ) : (
                  <Message>Još nema prethodnih šišanja.</Message>
              )}
            </ListCard>
          </div>
        </div>
      </section>
  );
}