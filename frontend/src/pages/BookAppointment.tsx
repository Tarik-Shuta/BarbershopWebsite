import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { api, getSession } from "../lib/session.ts";

const barbers = ["Harun", "Keno", "Ajdin"];
const services = ["Šišanje", "Šišanje + brada", "Brada", "Pranje kose", "Vosak", "Urban Classic"];
const slots = Array.from({ length: 20 }, (_, index) => `${String(10 + Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "30" : "00"}`);
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
function withLocalOffset(date: string, time: string) {
  const local = new Date(`${date}T${time}:00`); const offset = -local.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-"; const abs = Math.abs(offset);
  return `${date}T${time}:00${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
}
function localMidnight(date: string) { return withLocalOffset(date, "00:00"); }
function nextDate(date: string) { const d = new Date(`${date}T12:00:00`); d.setDate(d.getDate() + 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
export default function BookAppointment() {
  const session = getSession();
  const [barber, setBarber] = useState(""); const [service, setService] = useState(services[0]);
  const [date, setDate] = useState(""); const [time, setTime] = useState(""); const [notes, setNotes] = useState("");
  const [booked, setBooked] = useState<string[]>([]); const [error, setError] = useState(""); const [confirmation, setConfirmation] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => {
    setTime(""); if (!barber || !date) { setBooked([]); return; }
    void api(`/bookings/availability?barber=${encodeURIComponent(barber)}&from=${encodeURIComponent(localMidnight(date))}&to=${encodeURIComponent(localMidnight(nextDate(date)))}`).then(async (response) => {
      const result = await response.json() as { booked?: string[] }; setBooked(result.booked ?? []);
    }).catch(() => setBooked([]));
  }, [barber, date]);
  const available = slots.filter((slot) => {
    const start = new Date(withLocalOffset(date, slot));
    return start > new Date() && !booked.includes(start.toISOString());
  });
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setConfirmation("");
    if (!session) { setError("Prijavite se ili napravite račun prije rezervacije."); return; }
    if (!time) { setError("Odaberite slobodan termin."); return; }
    setBusy(true);
    try {
      const response = await api("/bookings", { method: "POST", body: JSON.stringify({ barber, service, startsAt: withLocalOffset(date, time), notes }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) { setError(result.error ?? "Termin nije moguće rezervisati."); return; }
      setConfirmation("Zahtjev je poslan. Termin je na čekanju dok ga barber ne prihvati."); setTime(""); setNotes("");
    } catch { setError("Nije moguće povezati se sa serverom."); }
    finally { setBusy(false); }
  }
  const input = "mt-2 w-full rounded-lg border border-white/15 bg-[#071c33] px-4 py-3 text-base text-white outline-none focus:border-cyan-300";
  return <section className="min-h-[calc(100svh-5rem)] bg-[#041426] px-5 py-12 text-left sm:px-8 sm:py-16"><div className="mx-auto max-w-3xl">
    <Link to="/" className="text-sm font-medium text-cyan-300">← Povratak na početnu</Link>
    <div className="mt-8 border-b border-white/10 pb-7"><p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Urban Barbershop</p><h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">Zakažite termin</h1><p className="mt-3 text-white/60">Izaberite barbera, datum i slobodan termin od 30 minuta. Radno vrijeme za rezervacije je 10:00–20:00.</p></div>
    {!session ? <div className="mt-8 rounded-xl border border-white/10 p-5 text-white/70">Za rezervaciju se prvo <Link className="text-cyan-300" to="/account">prijavite ili registrujte</Link>.</div> : <form onSubmit={submit} className="mt-8 space-y-6">
      <p className="text-sm text-white/65">Rezervacija za <span className="text-white">{session.user.name}</span> · {session.user.phone}</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm text-white/80">Barber<select className={input} required value={barber} onChange={(e) => setBarber(e.target.value)}><option value="" disabled>Odaberite barbera</option>{barbers.map((name) => <option key={name}>{name}</option>)}</select></label>
        <label className="block text-sm text-white/80">Usluga<select className={input} value={service} onChange={(e) => setService(e.target.value)}>{services.map((name) => <option key={name}>{name}</option>)}</select></label>
        <label className="block text-sm text-white/80">Datum<input className={input} type="date" min={today()} required value={date} onChange={(e) => setDate(e.target.value)} /></label>
        <label className="block text-sm text-white/80">Slobodan termin<select className={input} required value={time} onChange={(e) => setTime(e.target.value)} disabled={!date || !barber}><option value="" disabled>{!date || !barber ? "Prvo izaberite barbera i datum" : "Odaberite vrijeme"}</option>{available.map((slot) => <option key={slot} value={slot}>{slot}</option>)}</select></label>
        <label className="block text-sm text-white/80 sm:col-span-2">Napomena <span className="font-normal text-white/45">(opcionalno)</span><textarea className={`${input} min-h-28 resize-y`} maxLength={1000} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Dodatne informacije za vaš termin" /></label>
      </div>
      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}{confirmation && <p role="status" className="text-sm text-cyan-200">{confirmation}</p>}
      <button type="submit" disabled={busy} className="min-h-12 rounded-full bg-cyan-400 px-7 py-3 text-sm font-semibold text-[#071c33] disabled:opacity-60">{busy ? "Šaljem zahtjev…" : "Zatraži termin"}</button>
    </form>}
  </div></section>;
}
