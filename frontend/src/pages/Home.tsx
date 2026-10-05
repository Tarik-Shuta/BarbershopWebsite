import { Link } from "react-router-dom";
import enterijer from "../assets/benterijer.png";
import BarbershopMap from "../components/BarbershopMap.tsx";
import BarbersSection from "../components/BarbersSection.tsx";
import Prices from "../components/Prices.tsx";
import ContactSection from "../components/ContactSection.tsx";

/*const services = [
    {
        number: "01",
        title: "Muško šišanje",
        description:
            "Precizno šišanje prilagođeno vašem stilu, obliku lica i željenom izgledu.",
        price: "20 KM",
        image: enterijer,e
    },
    {
        number: "02",
        title: "Uređivanje brade",
        description:
            "Oblikovanje i uređivanje brade za čist, uredan i moderan izgled.",
        price: "15 KM",
        image: enterijer,
    },
    {
        number: "03",
        title: "Šišanje + brada",
        description:
            "Kompletan tretman koji kombinuje šišanje i profesionalno uređivanje brade.",
        price: "30 KM",
        image: enterijer,
    },
];*/

export default function Home() {
    return (
        <main className="overflow-hidden bg-[#041426] text-white">


            {/* =========================================================
                HERO
            ========================================================= */}
            <section
                id="top"
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
                            absolute top-1/2 left-1/2
                            h-105 w-170
                            -translate-x-1/2 -translate-y-1/2
                        "
                    >
                        <div
                            className="
                                absolute top-[10%] left-[15%]
                                h-92 w-72
                                rounded-[45%_55%_60%_40%/45%_45%_55%_55%]
                                border border-white/10
                                bg-white/6
                                shadow-[inset_0_0_60px_rgba(255,255,255,0.03),0_30px_80px_rgba(0,0,0,0.3)]
                                backdrop-blur-xl
                                animate-[floatBubbleOne_9s_ease-in-out_infinite]
                            "
                        />

                        <div
                            className="
                                absolute top-[18%] right-[10%]
                                h-56 w-66
                                rounded-[55%_45%_40%_60%/60%_45%_55%_40%]
                                border border-cyan-300/10
                                bg-cyan-300/6
                                shadow-[0_0_70px_rgba(34,211,238,0.08)]
                                backdrop-blur-xl
                                animate-[floatBubbleTwo_11s_ease-in-out_infinite]
                            "
                        />

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
                                absolute top-1/2 left-1/2
                                h-80 w-80
                                -translate-x-1/2 -translate-y-1/2
                                rounded-full
                                bg-cyan-400/10
                                blur-[100px]
                                animate-pulse
                            "
                        />
                    </div>

                    {/* Actual hero text */}
                    <div className="relative z-10 flex flex-col items-center">
                        <p
                            className="
            mb-5 text-xs font-bold uppercase
            tracking-[0.3em] text-cyan-400
            drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]
            drop-shadow-[0_0_12px_rgba(34,211,238,0.35)]
            sm:text-sm
    "
                        >
                            Urban Barbershop
                        </p>

                        <h1
                            className="
                                text-5xl leading-none font-bold
                                tracking-[-0.04em] text-white
                                drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)]
                                sm:text-6xl lg:text-7xl
                            "
                        >
                            Stil počinje ovdje
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

                        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                            <Link
                                to="/book"
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

                            <a
                                href="#usluge"
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
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                O NAMA
            ========================================================= */}
            <section
                id="o-nama"
                className="
         relative scroll-mt-24 overflow-hidden
         border-t border-white/5
         pt-24 pb-10
          sm:pt-32 sm:pb-14
    "
            >
                {/* Background decoration */}
                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute -top-32 -right-32
                        h-96 w-96 rounded-full
                        bg-cyan-400/5
                        blur-[100px]
                    "
                />

                <div data-reveal className="relative mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-center lg:px-8 mb-12">

                    {/* Image */}
                    <div className="relative">
                        <div
                            className="
                                absolute -inset-3
                                rounded-4xl
                                bg-linear-to-br
                                from-cyan-400/15
                                via-transparent
                                to-transparent
                                blur-xl
                            "
                        />

                        <div className="
                                relative overflow-hidden
                                rounded-4xl
                                border border-white/10
                                bg-white/5
                                shadow-[0_10px_100px_rgba(0,0,0,0.35)]
                            ">
                            <div className="h-120">
                                <BarbershopMap />
                            </div>

                            <div
                                className="
                                    absolute inset-0
                                    bg-linear-to-t
                                    from-[#041426]/60
                                    via-transparent
                                    to-transparent
                                "
                            />
                        </div>


                    </div>

                    {/* *******************Content desna strana O NAMA ******************* */}
                    <div className="lg:pl-8">
                        <p
                            className="
                                text-xs font-semibold uppercase
                                tracking-[0.3em]
                                text-cyan-300
                                sm:text-sm
                            "
                        >
                            O nama
                        </p>

                        <h2
                            className="
                                mt-5 max-w-xl
                                text-4xl leading-tight font-bold
                                tracking-[-0.035em]
                                text-white
                                sm:text-5xl
                            "
                        >
                            Stil počinje dobrim šišanjem.
                        </h2>

                        <p
                            className="
                                mt-6 max-w-xl
                                text-base leading-8
                                text-white/60
                                sm:text-lg
                            "
                        >
                            Urban Barbershop je mjesto za dobar stil, precizno šišanje i opuštenu atmosferu.
                            Svakom klijentu pristupamo individualno kako bi dobio frizuru i izgled koji mu stvarno odgovaraju.
                        </p>

                    </div>

                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-70 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/5 blur-[100px]"
                    />

                </div>
                <BarbersSection />

            </section>
            <Prices />
            <ContactSection />




            {/* Footer */}
            <footer className="border-t border-white/5 bg-[#03101f]">
                <div
                    className="
                        mx-auto flex max-w-7xl
                        flex-col items-center justify-between
                        gap-5 px-6 py-10
                        text-center
                        md:flex-row md:text-left
                        lg:px-8
                    "
                >
                    <div>
                        <p className="text-lg font-semibold text-white">
                            Urban Barbershop
                        </p>

                        <p className="mt-1 text-sm text-white/40">
                            Stil. Preciznost. Urban.
                        </p>
                    </div>

                    <p className="text-xs text-white/30">
                        © {new Date().getFullYear()} Urban Barbershop
                    </p>
                </div>
            </footer>
        </main>
    );
}
