import { Link } from "react-router-dom";
import haircut1 from "../assets/Haircut1.png"
import haircut2 from "../assets/Haircut2.png"
import haircut3 from "../assets/Haircut3.png"
import haircut4 from "../assets/Haircut4.png"

const services = [
    { name: "Šišanje", price: "20 KM" },
    { name: "Šišanje + brada", price: "25 / 30 KM" },
    { name: "Brada", price: "10 KM" },
    { name: "Pranje kose", price: "5 KM" },
    { name: "Vosak", price: "5 / 10 KM" },
    { name: "Urban Classic", price: "50 KM" },
];

const haircutImages = [
    {
        image: haircut1,
        label: "Fade",
    },
    {
        image: haircut3,
        label: "Classic",
    },
    {
        image: haircut4,
        label: "Modern",
    },
    {

        image: haircut2,
        label: "Urban",
    },
];

function HaircutCard({
                         image,
                         label,
                         className = "",
                     }: {
    image: string;
    label: string;
    className?: string;
}) {
    return (
        <figure
            className={`
                group relative isolate overflow-hidden rounded-2xl
                border border-white/10 bg-[#071c33]
                shadow-[0_20px_50px_rgba(0,0,0,0.25)]
                transition-[border-color,box-shadow] duration-300 ease-out
                hover:border-cyan-300/35
                hover:shadow-[0_25px_70px_rgba(0,0,0,0.4)]
                ${className}
            `}
        >
            {/* IMAGE */}
            <img
                src={image}
                alt={`Primjer frizure - ${label}`}
                loading="lazy"
                className="
                    h-full w-full object-cover
                    transition-transform duration-700 ease-out
                    group-hover:scale-[1.08]
                    group-hover:-translate-y-1
                    motion-reduce:transform-none
                    motion-reduce:transition-none
                "
            />

            {/* DARK OVERLAY */}
            <div
                aria-hidden="true"
                className="
                    absolute inset-0
                    bg-linear-to-t
                    from-[#041426]/95
                    via-[#041426]/15
                    to-transparent
                    opacity-70
                    transition-opacity duration-300
                    group-hover:opacity-90
                "
            />

            {/* CYAN BOTTOM GLOW */}
            <div
                aria-hidden="true"
                className="
                    absolute -bottom-16 left-1/2
                    h-32 w-3/4
                    -translate-x-1/2
                    rounded-full
                    bg-cyan-400/0
                    blur-3xl
                    transition-all duration-500
                    group-hover:-bottom-10
                    group-hover:bg-cyan-400/15
                "
            />

            {/* LIGHT SWEEP */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute -top-1/2 left-0
                    h-[200%] w-1/3
                    translate-x-[-180%]
                    rotate-15
                    bg-linear-to-r
                    from-transparent
                    via-white/10
                    to-transparent
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:translate-x-[420%]
                    motion-reduce:hidden
                "
            />

            {/* SUBTLE INNER BORDER */}
            <div
                aria-hidden="true"
                className="
                    absolute inset-3
                    rounded-xl
                    border border-white/0
                    transition-all duration-300
                    group-hover:border-white/8
                "
            />


        </figure>
    );
}

export default function Prices() {
    return (
        <section
            id="usluge"
            aria-labelledby="services-heading"
            className="relative scroll-mt-20 overflow-hidden bg-[#041426] pt-16 pb-8 sm:pt-20 sm:pb-10"
        >
            {/* Background glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-1/2 h-[28rem] w-[28rem]
                -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.04] blur-[110px]"
            />

            <div data-reveal className="relative mx-auto max-w-[90rem] px-5 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300 sm:text-sm">
                        Usluge
                    </p>

                    <h2
                        id="services-heading"
                        className="mt-4 text-4xl leading-tight font-bold tracking-[-0.035em] text-white sm:text-5xl"
                    >
                        Stil u svakom detalju.
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/60 sm:text-lg">
                        Precizno šišanje, uređivanje brade i stil koji ti odgovara.
                    </p>
                </div>

                {/* Desktop composition */}
                <div
                    className="hidden items-center gap-5 lg:grid
                    lg:grid-cols-[minmax(170px,1fr)_minmax(560px,672px)_minmax(170px,1fr)]
                    xl:gap-7"
                >
                    {/* LEFT IMAGES */}
                    <div className="flex h-[31rem] flex-col gap-5">
                        <HaircutCard
                            image={haircutImages[0].image}
                            label={haircutImages[0].label}
                            className="h-[58%]"
                        />

                        <HaircutCard
                            image={haircutImages[1].image}
                            label={haircutImages[1].label}
                            className="ml-8 h-[42%]"
                        />
                    </div>

                    {/* CENTER PRICE LIST */}
                    <article
                        className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl
                        border border-white/10 bg-white/[0.035]
                        p-6 shadow-[0_30px_80px_rgba(0,0,0,0.22)]
                        backdrop-blur-sm xl:p-8"
                    >
                        {/* Tiny top highlight */}
                        <div
                            aria-hidden="true"
                            className="absolute inset-x-12 top-0 h-px bg-linear-to-r
                            from-transparent via-cyan-300/30 to-transparent"
                        />

                        {/* Card heading */}
                        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-5">
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white">
                                    Cjenovnik
                                </h3>

                                <p className="mt-1 text-sm text-white/40">
                                    Urban Barbershop
                                </p>
                            </div>

                            <span
                                aria-hidden="true"
                                className="flex h-9 w-9 items-center justify-center rounded-full
                                border border-cyan-300/20 bg-cyan-300/5"
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                            </span>
                        </div>

                        {/* Prices */}
                        <ul>
                            {services.map((service, index) => (
                                <li
                                    key={service.name}
                                    className={`group flex items-center gap-3 py-4 ${
                                        index !== services.length - 1
                                            ? "border-b border-white/[0.07]"
                                            : ""
                                    }`}
                                >
                                    <span
                                        className="shrink-0 text-base font-medium text-white
                                        transition-colors duration-200 group-hover:text-cyan-100"
                                    >
                                        {service.name}
                                    </span>

                                    <span
                                        aria-hidden="true"
                                        className="mx-1 flex-1 border-b border-dotted border-white/15
                                        transition-colors duration-200 group-hover:border-cyan-300/20"
                                    />

                                    <span className="shrink-0 text-base font-semibold text-cyan-300">
                                        {service.price}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* CTA */}
                        <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
                            <p className="text-sm text-white/45">
                                Spreman za svoj novi stil?
                            </p>

                            <Link
                                to="/book"
                                className="group inline-flex items-center gap-2 rounded-full bg-cyan-400
                                px-5 py-2.5 text-sm font-semibold text-[#071c33]
                                transition-all duration-200 ease-out
                                hover:bg-cyan-300
                                hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]
                                focus-visible:outline-2 focus-visible:outline-offset-4
                                focus-visible:outline-cyan-300"
                            >
                                Zakaži termin

                                <span
                                    aria-hidden="true"
                                    className="transition-transform duration-200 ease-out
                                    group-hover:translate-x-1
                                    motion-reduce:transition-none
                                    motion-reduce:group-hover:translate-x-0"
                                >
                                    →
                                </span>
                            </Link>
                        </div>
                    </article>

                    {/* RIGHT IMAGES */}
                    <div className="flex h-[31rem] flex-col gap-5">
                        <HaircutCard
                            image={haircutImages[2].image}
                            label={haircutImages[2].label}
                            className="mr-8 h-[42%]"
                        />

                        <HaircutCard
                            image={haircutImages[3].image}
                            label={haircutImages[3].label}
                            className="h-[58%]"
                        />
                    </div>
                </div>

                {/* MOBILE / TABLET */}
                <div className="lg:hidden">
                    {/* Images */}
                    <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4">
                        {haircutImages.map((item, index) => (
                            <HaircutCard
                                key={`${item.label}-${index}`}
                                image={item.image}
                                label={item.label}
                                className="aspect-[4/5]"
                            />
                        ))}
                    </div>

                    {/* Price list */}
                    <article
                        className="mx-auto max-w-2xl rounded-2xl border border-white/10
                        bg-white/[0.035] p-5
                        shadow-[0_20px_60px_rgba(0,0,0,0.18)]
                        sm:p-7"
                    >
                        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-5">
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white">
                                    Cjenovnik
                                </h3>

                                <p className="mt-1 text-sm text-white/40">
                                    Urban Barbershop
                                </p>
                            </div>

                            <span
                                aria-hidden="true"
                                className="flex h-9 w-9 items-center justify-center rounded-full
                                border border-cyan-300/20 bg-cyan-300/5"
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                            </span>
                        </div>

                        <ul>
                            {services.map((service, index) => (
                                <li
                                    key={service.name}
                                    className={`flex items-center gap-2 py-3.5 sm:gap-3 sm:py-4 ${
                                        index !== services.length - 1
                                            ? "border-b border-white/[0.07]"
                                            : ""
                                    }`}
                                >
                                    <span className="shrink-0 text-sm font-medium text-white sm:text-base">
                                        {service.name}
                                    </span>

                                    <span
                                        aria-hidden="true"
                                        className="mx-1 flex-1 border-b border-dotted border-white/15"
                                    />

                                    <span className="shrink-0 text-sm font-semibold text-cyan-300 sm:text-base">
                                        {service.price}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-5 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row">
                            <p className="text-center text-sm text-white/45 sm:text-left">
                                Spreman za svoj novi stil?
                            </p>

                            <Link
                                to="/book"
                                className="group inline-flex items-center gap-2 rounded-full bg-cyan-400
                                px-5 py-2.5 text-sm font-semibold text-[#071c33]
                                transition-colors duration-200 hover:bg-cyan-300"
                            >
                                Zakaži termin
                                <span
                                    aria-hidden="true"
                                    className="transition-transform duration-200 group-hover:translate-x-1"
                                >
                                    →
                                </span>
                            </Link>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}