const barbers = [
    { name: "Harun", phone: "060 346 4465", href: "tel:+387603464465" },
    { name: "Kenan", phone: "062 072 671", href: "tel:+38762072671" },
    { name: "Ajdin", phone: "061 465 931", href: "tel:+38761465931" },
];

const address = "Emira Bogunića Čarlija 27";
const directionsUrl =
    "https://www.google.com/maps/dir/?api=1&destination=43.83145874040907,18.30542709242597";

function ArrowIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
            <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function ContactSection() {
    return (
        <section
            id="kontakt"
            aria-labelledby="contact-heading"
            className="relative scroll-mt-20 overflow-hidden border-t border-white/5 bg-[#041426] py-20 sm:py-24"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-cyan-400/[0.06] blur-[110px]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-48 -left-32 h-96 w-96 rounded-full bg-cyan-400/[0.04] blur-[110px]"
            />

            <div data-reveal className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300 sm:text-sm">
                            Kontakt
                        </p>
                        <h2
                            id="contact-heading"
                            className="mt-5 max-w-xl text-4xl leading-tight font-bold tracking-[-0.035em] text-white sm:text-5xl"
                        >
                            Vrijeme je za novi stil.
                        </h2>
                        <p className="mt-5 max-w-xl text-base leading-8 text-white/60 sm:text-lg">
                            Odaberi svog barbera i rezerviši termin direktnim pozivom. Za ostale upite, piši nam ili nas posjeti u salonu.
                        </p>

                        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                            <a
                                href={directionsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/[0.06]"
                            >
                                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Adresa</span>
                                <span className="mt-3 flex items-end justify-between gap-4 text-base font-medium leading-6 text-white">
                                    {address}
                                    <span className="mb-1 shrink-0 text-cyan-300 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">
                                        <ArrowIcon />
                                    </span>
                                </span>
                            </a>

                            <a
                                href="mailto:urbanbarbershop@gmail.com"
                                className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/[0.06]"
                            >
                                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Email</span>
                                <span className="mt-3 flex items-end justify-between gap-4 break-all text-sm font-medium leading-6 text-white sm:text-base lg:text-sm xl:text-base">
                                    urbanbarbershop@gmail.com
                                    <span className="mb-1 shrink-0 text-cyan-300 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">
                                        <ArrowIcon />
                                    </span>
                                </span>
                            </a>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
                        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-7">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Direktna rezervacija</p>
                                <p className="mt-1 text-sm text-white/40">Pozovi barbera po izboru</p>
                            </div>
                            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.7)]" />
                        </div>

                        <ul className="divide-y divide-white/[0.07] px-5 sm:px-7">
                            {barbers.map((barber, index) => (
                                <li key={barber.name}>
                                    <a
                                        href={barber.href}
                                        aria-label={`Pozovi barbera ${barber.name} na ${barber.phone}`}
                                        className="group flex items-center gap-4 py-6 sm:gap-6"
                                    >
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] text-xs font-semibold text-cyan-300">
                                            0{index + 1}
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-lg font-semibold text-white transition-colors duration-200 group-hover:text-cyan-100">
                                                {barber.name}
                                            </span>
                                            <span className="mt-1 block text-sm text-white/40">Barber</span>
                                        </span>
                                        <span className="text-right">
                                            <span className="block text-sm font-semibold text-cyan-300 sm:text-base">{barber.phone}</span>
                                            <span className="mt-1 hidden items-center justify-end gap-1 text-xs text-white/35 transition-colors duration-200 group-hover:text-white/60 sm:flex">
                                                Pozovi <ArrowIcon />
                                            </span>
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
