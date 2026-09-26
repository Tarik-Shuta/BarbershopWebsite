import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import Logo from '../assets/Urban.png'

const navItems = [
    { label: 'O nama', to: '/aboutme' },
    { label: 'Usluge', to: '/usluge' },
    { label: 'Kontakt', to: '/kontakt' },
]

export default function Layout() {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <>
            <header
                className="
                    fixed inset-x-0 top-0 z-50
                    border-b border-white/10
                    bg-[#071c33]/85
                    shadow-[0_8px_40px_rgba(0,0,0,0.18)]
                    backdrop-blur-xl
                "
            >

                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-400/40 to-transparent" />

                <nav className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-6 lg:px-8">

                    {/* Logo */}
                    <NavLink
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className="
            group relative
            flex shrink-0 items-center
            justify-self-start
            transition-opacity duration-300
            hover:opacity-90
        "
                    >
                        <img
                            src={Logo}
                            alt="Urban Barbershop"
                            className="
                h-20 w-auto object-contain
                transition-transform duration-300
                group-hover:scale-[1.03]
            "
                        />
                    </NavLink>

                    <div className="hidden items-center gap-10 md:flex">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `
                    group relative py-2
                    text-sm font-medium tracking-wide
                    transition-colors duration-300
                    ${
                                        isActive
                                            ? 'text-white'
                                            : 'text-white/65 hover:text-white'
                                    }
                `
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {item.label}

                                        <span
                                            className={`
                                absolute right-0 bottom-0 left-0
                                mx-auto h-0.5
                                rounded-full
                                bg-cyan-400
                                transition-all duration-300
                                ${
                                                isActive
                                                    ? 'w-full opacity-100'
                                                    : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                                            }
                            `}
                                        />
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    <NavLink
                        to="/kontakt"
                        className="
            group relative hidden
            justify-self-end
            overflow-hidden rounded-full
            border border-cyan-300/20
            bg-cyan-400
            px-6 py-3
            text-sm font-semibold
            text-[#071c33]
            shadow-[0_8px_30px_rgba(34,211,238,0.15)]
            transition-all duration-300
            hover:-translate-y-0.5
            hover:bg-cyan-300
            hover:shadow-[0_10px_35px_rgba(34,211,238,0.25)]
            md:inline-flex
        ">
        <span className="relative z-10 flex items-center gap-2">
            Zakaži termin
            <span
                aria-hidden="true"
                className="
                    transition-transform duration-300
                    group-hover:translate-x-1
                "
            >
                →
            </span>
        </span>
                    </NavLink>


                    <button
                        type="button"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="
            flex size-11 items-center justify-center
            justify-self-end
            rounded-xl
            border border-white/10
            bg-white/5
            text-white
            transition-colors duration-300
            hover:bg-white/10
            md:hidden
        "
                        aria-label="Menu"
                        aria-expanded={menuOpen}
                    >
                        <div className="flex w-5 flex-col gap-1.5">
            <span
                className={`
                    h-0.5 w-full rounded-full bg-white
                    transition-all duration-300
                    ${menuOpen ? 'translate-y-2 rotate-45' : ''}
                `}
            />

                            <span
                                className={`
                    h-0.5 w-full rounded-full bg-white
                    transition-all duration-300
                    ${menuOpen ? 'opacity-0' : 'opacity-100'}
                `}
                            />

                            <span
                                className={`
                    h-0.5 w-full rounded-full bg-white
                    transition-all duration-300
                    ${menuOpen ? '-translate-y-2 -rotate-45' : ''}
                `}
                            />
                        </div>
                    </button>
                </nav>

                {/* Mobile menu */}
                <div
                    className={`
                        overflow-hidden
                        border-t border-white/10
                        bg-[#071c33]/95
                        backdrop-blur-xl
                        transition-all duration-300
                        md:hidden
                        ${
                        menuOpen
                            ? 'max-h-96 opacity-100'
                            : 'max-h-0 border-transparent opacity-0'
                    }
                    `}
                >
                    <div className="mx-auto flex max-w-7xl flex-col px-5 py-5 sm:px-6">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) =>
                                    `
                                    border-b border-white/5
                                    py-4
                                    text-base font-medium
                                    transition-colors duration-300
                                    ${
                                        isActive
                                            ? 'text-cyan-300'
                                            : 'text-white/70 hover:text-white'
                                    }
                                `
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}

                        <NavLink
                            to="/kontakt"
                            onClick={() => setMenuOpen(false)}
                            className="
                                mt-5 flex items-center justify-center
                                rounded-full
                                bg-cyan-400
                                px-6 py-3
                                text-sm font-semibold
                                text-[#071c33]
                                transition-colors
                                hover:bg-cyan-300
                            "
                        >
                            Zakaži termin
                        </NavLink>
                    </div>
                </div>
            </header>

            <main className="pt-20">
                <Outlet />
            </main>
        </>
    )
}