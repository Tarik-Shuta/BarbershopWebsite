import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, clearSession, getSession } from "../lib/session.ts";

type Booking = { id: string; name: string; phone: string; service: string; startsAt: string; status: "PENDING" | "CONFIRMED" | "DECLINED"; notes: string | null; user: { email: string } | null };
const clock = (value: string) => new Intl.DateTimeFormat("bs-BA", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
const calendarDate = (value: string) => new Intl.DateTimeFormat("bs-BA", { dateStyle: "full" }).format(new Date(value));
const dateInput = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

function dateRange(value: string) {
  const start = new Date(`${value}T00:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  const withOffset = (date: Date) => {
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const abs = Math.abs(offset);
    return `${date.toISOString().slice(0, 19)}${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
  };
  return { from: withOffset(start), to: withOffset(end) };
}

export default function BarberDashboard() {
  const session = getSession();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [schedule, setSchedule] = useState<Booking[]>([]);
  const [history, setHistory] = useState<Booking[]>([]);
  const [scheduleDate, setScheduleDate] = useState(dateInput(new Date()));
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const response = await api("/bookings/queue");
    const result = await response.json() as { error?: string; bookings?: Booking[] };
    if (!response.ok) { setError(result.error ?? "Could not load bookings"); return; }
    setBookings(result.bookings ?? []);
  }, []);

  const loadSchedule = useCallback(async () => {
    const query = new URLSearchParams(dateRange(scheduleDate));
    const response = await api(`/bookings/schedule?${query}`);
    const result = await response.json() as { error?: string; bookings?: Booking[] };
    if (!response.ok) { setError(result.error ?? "Could not load daily schedule"); return; }
    setSchedule(result.bookings ?? []);
  }, [scheduleDate]);

  const loadHistory = useCallback(async () => {
    const response = await api("/bookings/history");
    const result = await response.json() as { error?: string; bookings?: Booking[] };
    if (!response.ok) { setError(result.error ?? "Could not load past appointments"); return; }
    setHistory(result.bookings ?? []);
  }, []);

  useEffect(() => {
    if (session?.user.role !== "BARBER") { navigate("/account"); return; }
    void load().catch(() => setError("Could not connect to the server"));
  }, [load, navigate, session?.user.role]);
  useEffect(() => {
    if (session?.user.role === "BARBER") void loadSchedule().catch(() => setError("Could not load daily schedule"));
  }, [loadSchedule, session?.user.role]);
  useEffect(() => {
    if (session?.user.role === "BARBER") void loadHistory().catch(() => setError("Could not load past appointments"));
  }, [loadHistory, session?.user.role]);

  async function decide(id: string, status: "CONFIRMED" | "DECLINED") {
    const response = await api(`/bookings/${id}/decision`, { method: "PATCH", body: JSON.stringify({ status }) });
    if (!response.ok) {
      const result = await response.json() as { error?: string };
      setError(result.error ?? "Could not update booking");
      return;
    }
    await Promise.all([load(), loadSchedule(), loadHistory()]);
  }

  if (session?.user.role !== "BARBER") return null;
  const nextAppointment = schedule.find((booking) => new Date(booking.startsAt) > new Date());

  return <section className="min-h-[calc(100svh-5rem)] bg-[#041426] px-5 py-12 text-white sm:px-8 sm:py-16"><div className="mx-auto max-w-4xl">
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-7">
      <div><p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Barber dashboard</p><h1 className="mt-3 text-4xl font-bold">Rezervacije</h1><p className="mt-2 text-white/60">{session.user.barberName} · budući zahtjevi i današnji termini</p></div>
      <button className="text-sm text-cyan-300" onClick={() => { clearSession(); navigate("/account"); }}>Odjava</button>
    </div>
    {error && <p role="alert" className="mt-5 text-rose-300">{error}</p>}

    <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Accepted appointments</p><h2 className="mt-2 text-2xl text-white">Daily schedule</h2></div>
        <label className="text-sm text-white/70">Choose day<input type="date" value={scheduleDate} onChange={(event) => setScheduleDate(event.target.value)} className="mt-1 block rounded-lg border border-white/15 bg-[#071c33] px-3 py-2 text-white" /></label>
      </div>
      {nextAppointment && dateInput(new Date(nextAppointment.startsAt)) === scheduleDate && <p className="mt-5 rounded-lg bg-cyan-400/10 px-4 py-3 text-sm text-cyan-200">Next accepted haircut: <strong>{clock(nextAppointment.startsAt)}</strong> · {nextAppointment.name}</p>}
      <div className="mt-4 divide-y divide-white/10">{schedule.map((booking) => <article key={booking.id} className="flex flex-wrap items-center gap-x-5 gap-y-1 py-4"><p className="w-16 text-xl font-semibold text-cyan-300">{clock(booking.startsAt)}</p><div><p className="font-medium text-white">{booking.name} <span className="font-normal text-white/50">· {booking.service}</span></p><p className="text-sm text-white/55">{booking.phone}</p></div></article>)}{!schedule.length && <p className="py-6 text-sm text-white/55">No upcoming accepted appointments for this day.</p>}</div>
    </section>

    <section className="mt-8">
      <h2 className="mb-4 text-2xl font-semibold">Haircut reservation requests</h2>
      <div className="space-y-4">{bookings.map((booking) => <article key={booking.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex sm:items-center sm:justify-between sm:gap-5">
        <div><p className="text-sm text-white/60">{calendarDate(booking.startsAt)}</p><p className="text-2xl font-semibold text-cyan-300">{clock(booking.startsAt)}</p><h3 className="mt-1 text-lg text-white">{booking.name} <span className="text-sm font-normal text-white/50">· {booking.service}</span></h3><p className="mt-1 text-sm text-white/60">{booking.phone} · {booking.user?.email}</p>{booking.notes && <p className="mt-2 text-sm text-white/55">Napomena: {booking.notes}</p>}<p className="mt-2 text-xs uppercase tracking-wider text-white/50">{booking.status === "PENDING" ? "Čeka odluku" : "Prihvaćen"}</p></div>
        {booking.status === "PENDING" && <div className="mt-4 flex gap-2 sm:mt-0"><button onClick={() => void decide(booking.id, "CONFIRMED")} className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-[#071c33]">Prihvati</button><button onClick={() => void decide(booking.id, "DECLINED")} className="rounded-full border border-white/20 px-4 py-2 text-sm">Odbij</button></div>}
      </article>)}{!bookings.length && !error && <p className="rounded-2xl border border-white/10 p-6 text-center text-white/55">Nema zahtjeva za termine koji tek dolaze.</p>}</div>
    </section>

    <section className="mt-10">
      <h2 className="mb-4 text-2xl font-semibold">Past haircuts</h2>
      <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03] px-5">{history.map((booking) => <article key={booking.id} className="flex flex-wrap items-center gap-x-5 gap-y-1 py-4"><div><p className="text-sm text-white/55">{calendarDate(booking.startsAt)} at {clock(booking.startsAt)}</p><p className="font-medium text-white">{booking.name} <span className="font-normal text-white/50">· {booking.service}</span></p></div><p className="text-sm text-white/55">{booking.phone}</p></article>)}{!history.length && !error && <p className="py-6 text-sm text-white/55">No completed haircuts yet.</p>}</div>
    </section>
    <Link to="/" className="mt-8 inline-block text-sm text-cyan-300">← Početna</Link>
  </div></section>;
}
