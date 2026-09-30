import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

const apiUrl = (import.meta.env.VITE_API_URL ?? "http://localhost:3000").replace(/\/+$/, "");

const barbers = ["Harun", "Keno", "Ajdin"];
const services = ["Šišanje", "Šišanje + brada", "Brada", "Pranje kose", "Vosak", "Urban Classic"];

type BookingForm = {
  name: string;
  phone: string;
  barber: string;
  service: string;
  startsAt: string;
  notes: string;
};

const initialForm: BookingForm = {
  name: "",
  phone: "",
  barber: "",
  service: "",
  startsAt: "",
  notes: "",
};

function toLocalDateTimeValue(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

export default function BookAppointment() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function updateField(field: keyof BookingForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setConfirmation("");

    const startsAt = new Date(form.startsAt);
    if (startsAt <= new Date()) {
      setError("Izaberite datum i vrijeme u budućnosti.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${apiUrl}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, startsAt: startsAt.toISOString() }),
      });

      const result: { error?: string } = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Termin nije moguće rezervisati.");
        return;
      }

      setConfirmation("Vaš zahtjev za termin je poslan. Javit ćemo vam se radi potvrde.");
      setForm(initialForm);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Nije moguće povezati se sa serverom. Pokušajte ponovo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClassName =
    "mt-2 w-full rounded-lg border border-white/15 bg-[#071c33] px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-cyan-300";

  return (
    <section className="min-h-[calc(100svh-5rem)] bg-[#041426] px-5 py-12 text-left sm:px-8 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200">
          ← Povratak na početnu
        </Link>

        <div className="mt-8 border-b border-white/10 pb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Urban Barbershop</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">Zakažite termin</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-white/60">
            Odaberite uslugu i vrijeme koje vam odgovara. Potvrdit ćemo termin telefonom.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-white/80">
              Ime i prezime
              <input
                className={inputClassName}
                type="text"
                name="name"
                autoComplete="name"
                minLength={2}
                maxLength={100}
                required
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Vaše ime"
              />
            </label>

            <label className="block text-sm font-medium text-white/80">
              Broj telefona
              <input
                className={inputClassName}
                type="tel"
                name="phone"
                autoComplete="tel"
                minLength={6}
                maxLength={30}
                required
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="+387 ..."
              />
            </label>

            <label className="block text-sm font-medium text-white/80">
              Barber
              <select
                className={inputClassName}
                name="barber"
                required
                value={form.barber}
                onChange={(event) => updateField("barber", event.target.value)}
              >
                <option value="" disabled>Odaberite barbera</option>
                {barbers.map((barber) => <option key={barber} value={barber}>{barber}</option>)}
              </select>
            </label>

            <label className="block text-sm font-medium text-white/80">
              Usluga
              <select
                className={inputClassName}
                name="service"
                required
                value={form.service}
                onChange={(event) => updateField("service", event.target.value)}
              >
                <option value="" disabled>Odaberite uslugu</option>
                {services.map((service) => <option key={service} value={service}>{service}</option>)}
              </select>
            </label>

            <label className="block text-sm font-medium text-white/80 sm:col-span-2">
              Datum i vrijeme
              <input
                className={inputClassName}
                type="datetime-local"
                name="startsAt"
                min={toLocalDateTimeValue(new Date())}
                required
                value={form.startsAt}
                onChange={(event) => updateField("startsAt", event.target.value)}
              />
            </label>

            <label className="block text-sm font-medium text-white/80 sm:col-span-2">
              Napomena <span className="font-normal text-white/45">(opcionalno)</span>
              <textarea
                className={`${inputClassName} min-h-28 resize-y`}
                name="notes"
                maxLength={1000}
                value={form.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                placeholder="Dodatne informacije za vaš termin"
              />
            </label>
          </div>

          {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
          {confirmation && <p role="status" className="text-sm text-cyan-200">{confirmation}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-cyan-400 px-7 py-3 text-sm font-semibold text-[#071c33] transition-colors hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? "Šaljem zahtjev…" : "Zatraži termin"}
          </button>
        </form>
      </div>
    </section>
  );
}
