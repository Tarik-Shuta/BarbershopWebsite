import Harun from "../assets/harun.png"
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
            aria-labelledby="barbers-heading"
            className="relative overflow-hidden bg-[#041426] py-24 sm:py-32"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-36 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/5 blur-[100px]"
            />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
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
                            <div className="aspect-4/5 overflow-hidden">
                                <img
                                    src={barber.image}
                                    alt={`Privremeni portret za ${barber.name};`}
                                    loading="lazy"
                                    className={`h-full w-full object-cover ${barber.imagePosition} transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
                                />
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