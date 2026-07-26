import { Outlet, Link } from 'react-router-dom'
import Logo from '../assets/Urban.png'

export default function Layout() {
    return (
        <>
            <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-[#0d386a]/90 backdrop-blur-lg">
                <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                    <Link
                        to="/"
                        className="text-2xl font-bold tracking-tight text-white transition hover:scale-120"
                    >
                        <img src={Logo} alt="Urban Barbershop" className="h-20 pt-2 w-auto "></img>
                    </Link>

                    <div className="flex items-center gap-20 text-sm font-medium pl-15">
                        <Link
                            to="/aboutme"
                            className="text-gray-300 hover:text-white hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer"
                        >
                            O nama
                        </Link>

                        <Link
                            to="/usluge"
                            className="text-gray-300 hover:text-white hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer"
                        >
                            Usluge
                        </Link>

                        <Link
                            to="/kontakt"
                            className="text-gray-300 hover:text-white hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer"
                        >
                            Kontakt
                        </Link>

                    </div>

                    <Link
                        to="/"
                        className="group relative inline-flex items-center justify-center rounded-full transition-all duration-300 hover:scale-105 focus:outline-none"
                    >

                        <div className="absolute -inset-0.5 rounded-full bg-linear-to-r from-black to-gray-900 opacity-60 blur transition duration-300 group-hover:opacity-100 group-hover:duration-200" />

                        <div className="relative flex h-full w-full items-center justify-center rounded-full bg-[#0d386a] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 group-hover:bg-cyan-800">
                            Zakaži termin
                        </div>
                    </Link>
                </nav>
            </header>

            <main className="pt-16">
                <Outlet />
            </main>
        </>
    )
}