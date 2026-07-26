import { Outlet, Link } from 'react-router-dom'
import Logo from '../assets/Urban.png'

export default function Layout() {
    return (
        <>
            <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-[#0d386a] backdrop-blur-lg">
                <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    <Link
                        to="/"
                        className="text-2xl font-bold tracking-tight text-white transition hover:scale-120"
                    >
                        <img src={Logo} alt="Urban Barbershop" className="h-20 pt-2 w-auto"></img>
                    </Link>

                    <div className="flex items-center gap-8 text-sm font-medium">
                        <Link
                            to="/aboutme"
                            className="text-gray-300 hover:text-indigo-600 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
                        >
                            O nama
                        </Link>

                        <Link
                            to="/usluge"
                            className="text-gray-300 transition duration-200 hover:text-cyan-400"
                        >
                            Usluge
                        </Link>

                        <Link
                            to="/kontakt"
                            className="text-gray-300 transition duration-200 hover:text-cyan-400"
                        >
                            Kontakt
                        </Link>

                    </div>

                    {/* CTA Button */}
                    <Link
                        to="/contact"
                        className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30"
                    >
                        Get Started
                    </Link>
                </nav>
            </header>

            <main className="pt-16">
                <Outlet />
            </main>
        </>
    )
}