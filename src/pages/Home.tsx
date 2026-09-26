import { Link } from "react-router-dom";
import enterijer from "../assets/benterijer.png";

export default function Home() {
    return (
        <section
            className="
                relative flex min-h-[calc(100svh-5rem)]
                items-center justify-center overflow-hidden
                bg-cover bg-center bg-no-repeat
            "
            style={{ backgroundImage: `url(${enterijer})` }}
        >
            {/* Background overlays */}
            <div className="absolute inset-0 bg-black/50" />

            <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/70 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/70 to-transparent" />

            {/* Hero content */}
            <div
                className="
        relative z-10 mx-auto flex w-full max-w-4xl
        flex-col items-center px-6 text-center
    "
            >
                {/* Animated glass bubbles */}
                <div
                    aria-hidden="true"
                    className="
            pointer-events-none
            absolute left-1/2 top-1/2
            h-105 w-170
            -translate-x-1/2 -translate-y-1/2">

                    <div
                        className="
                absolute left-[15%] top-[10%]
                h-92 w-72
                rounded-[45%_55%_60%_40%/45%_45%_55%_55%]
                border border-white/10
                bg-white/6
                shadow-[inset_0_0_60px_rgba(255,255,255,0.03),0_30px_80px_rgba(0,0,0,0.3)]
                backdrop-blur-xl
                animate-[floatBubbleOne_9s_ease-in-out_infinite]
            "
                    />

                    {/* Cyan bubble */}
                    <div
                        className="
                absolute right-[10%] top-[18%]
                h-56 w-66
                rounded-[55%_45%_40%_60%/60%_45%_55%_40%]
                border border-cyan-300/10
                bg-cyan-300/6
                shadow-[0_0_70px_rgba(34,211,238,0.08)]
                backdrop-blur-xl
                animate-[floatBubbleTwo_11s_ease-in-out_infinite]
            "
                    />

                    {/* Bottom bubble */}
                    <div
                        className="
                absolute bottom-[5%] left-[38%]
                h-52 w-46
                rounded-[40%_60%_55%_45%/55%_40%_60%_45%]
                border border-white/10
                bg-white/4
                backdrop-blur-lg
                animate-[floatBubbleThree_12s_ease-in-out_infinite]
            "
                    />


                    <div
                        className="
                absolute left-1/2 top-1/2
                h-80 w-80
                -translate-x-1/2 -translate-y-1/2
                rounded-full
                bg-cyan-400/10
                blur-[100px]
                animate-pulse
            "
                    />
                </div>


                <div className="relative z-10 flex flex-col items-center">
                    <p
                        className="
                mb-5 text-xs font-semibold uppercase
                tracking-[0.3em] text-cyan-300
                drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]
                sm:text-sm
            "
                    >
                        Urban Barbershop </p>

                    <h1
                        className="
                text-5xl leading-none font-bold
                tracking-[-0.04em] text-white
                drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)]
                sm:text-6xl
                lg:text-7xl
            "
                    >
                        Stil počinje ovdje.
                    </h1>

                    <p
                        className="
                mt-6 max-w-2xl
                text-base leading-relaxed
                text-white/80
                drop-shadow-[0_3px_12px_rgba(0,0,0,0.65)]
                sm:text-lg
            "
                    >
                        Profesionalno šišanje, precizno oblikovanje i moderna atmosfera
                        <br className="hidden sm:block" />
                        {" "}u srcu Urban Barbershopa.
                    </p>

                    <div
                        className="
                mt-9 flex flex-col items-center gap-3
                sm:flex-row
            "
                    >
                        <Link
                            to="/kontakt"
                            className="
                    inline-flex min-w-44 items-center justify-center
                    rounded-full bg-cyan-400 px-6 py-3.5
                    text-sm font-semibold text-[#071c33]
                    shadow-[0_8px_30px_rgba(34,211,238,0.2)]
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:bg-cyan-300
                    hover:shadow-[0_14px_40px_rgba(34,211,238,0.35)]
                "
                        >
                            Zakaži termin
                        </Link>

                        <Link
                            to="/usluge"
                            className="
                    inline-flex min-w-44 items-center justify-center
                    rounded-full
                    border border-white/20
                    bg-white/6
                    px-6 py-3.5
                    text-sm font-medium text-white
                    backdrop-blur-md
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-cyan-300/30
                    hover:bg-white/10
                "
                        >
                            Pogledaj usluge
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}