import Harun from "../assets/Harun.png"
const barbers = [
    {
        name: "Harun",
        role: "Barber",
        description: "",
        image: Harun,
        imagePosition: "object-[center_35%]",
    },
    {
        name: "Keno",
        role: "Barber",
        description: "",
        image: "",
        imagePosition: "object-[center_35%]",
    },
    {
        name: "Ajdin",
        role: "Barber",
        description: "Kratak opis stila",
        image: "",
        imagePosition: "object-[center_35%]",
    },
];

export default function BarbersSection() {
    return (
        <section
            id="nas-tim"
            aria-labelledby="barbers-heading"
            className="relative scroll-mt-20 overflow-hidden bg-[#041426] pt-12 pb-8 sm:pt-16 sm:pb-4"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-36 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/5 blur-[100px]"
            />

            <div data-reveal className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300 sm:text-sm">
                        Naš tim
                    </p>
                    <h2
                        id="barbers-heading"
                        className="mt-5 text-4xl leading-tight font-bold tracking-[-0.035em] text-white sm:text-5xl"
                    >
                        Upoznaj naše barbere.
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-8 text-balance text-white/60 sm:text-lg">
                        Tri barbera, jedan cilj - da pronađeš stil koji ti najbolje odgovara.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {barbers.map((barber, index) => (
                        <article
                            key={barber.name}
                            className="group relative isolate overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/30"
                        >
                            <div className="aspect-4/5 overflow-hidden bg-[#071c33]">
                                {barber.image ? (
                                    <img
                                        src={barber.image}
                                        alt={`${barber.name}, barber u Urban Barbershopu`}
                                        loading="lazy"
                                        className={`h-full w-full object-cover ${barber.imagePosition} transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
                                    />
                                ) : (
                                    <div
                                        aria-label={`Portret za ${barber.name} uskoro`}
                                        role="img"
                                        className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.16),transparent_36%),linear-gradient(145deg,#0a2947,#041426)]"
                                    >
                                        <span className="text-7xl font-bold tracking-[-0.06em] text-white/10">
                                            {barber.name.charAt(0)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div
                                aria-hidden="true"
                                className="absolute inset-0 bg-linear-to-t from-[#041426] via-[#041426]/45 to-transparent"
                            />

                            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                                    {barber.role} <span className="text-white/40">· 0{index + 1}</span>
                                </p>
                                <h3 className="text-2xl leading-tight font-semibold tracking-tight text-white sm:text-3xl">
                                    {barber.name}
                                </h3>
                                <p className="mt-2 text-sm text-white/65">
                                    {barber.description}
                                </p>
                                <div className="mt-5 h-px w-10 bg-cyan-400/70 transition-all duration-300 group-hover:w-16" />
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}