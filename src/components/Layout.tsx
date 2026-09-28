import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Logo from '../assets/Urban.png'

const navItems = [
    { label: 'O nama', href: '#o-nama', id: 'o-nama' },
    { label: 'Naš tim', href: '#nas-tim', id: 'nas-tim' },
    { label: 'Usluge', href: '#usluge', id: 'usluge' },
    { label: 'Kontakt', href: '#kontakt', id: 'kontakt' },
]

export default function Layout() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('')

    useEffect(() => {
        const sections = navItems
            .map((item) => document.getElementById(item.id))
            .filter((section): section is HTMLElement => section !== null)

        const sectionObserver = new IntersectionObserver(
            (entries) => {
                const visibleSection = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

                if (visibleSection) {
                    setActiveSection(visibleSection.target.id)
                }
            },
            { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
        )

        sections.forEach((section) => sectionObserver.observe(section))

        const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal]')
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible')
                        observer.unobserve(entry.target)
                    }
                })
            },
            { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
        )

        revealElements.forEach((element) => {
            element.classList.add('reveal-ready')
            revealObserver.observe(element)
        })

        return () => {
            sectionObserver.disconnect()
            revealObserver.disconnect()
        }
    }, [])

    useEffect(() => {
        const closeMenu = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMenuOpen(false)
            }
        }

        document.addEventListener('keydown', closeMenu)
        return () => document.removeEventListener('keydown', closeMenu)
    }, [])

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
                    <a
                        href="#top"
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
                    </a>

                    <div className="hidden items-center gap-10 md:flex">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                aria-current={activeSection === item.id ? 'location' : undefined}
                                className={`
                    group relative py-2
                    text-sm font-medium tracking-wide
                    transition-colors duration-300
                    ${activeSection === item.id
                                            ? 'text-white'
                                            : 'text-white/65 hover:text-white'
                                    }
                `}
                            >
                                {item.label}

                                        <span
                                            className={`
                                absolute right-0 bottom-0 left-0
                                mx-auto h-0.5
                                rounded-full
                                bg-cyan-400
                                transition-all duration-300
                                ${activeSection === item.id
                                                    ? 'w-full opacity-100'
                                                    : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                                            }
                            `}
                                        />
                            </a>
                        ))}
                    </div>

                    <a
                        href="#kontakt"
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
                    </a>


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
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                aria-current={activeSection === item.id ? 'location' : undefined}
                                className={`
                                    border-b border-white/5
                                    py-4
                                    text-base font-medium
                                    transition-colors duration-300
                                    ${activeSection === item.id
                                            ? 'text-cyan-300'
                                            : 'text-white/70 hover:text-white'
                                    }
                                `}
                            >
                                {item.label}
                            </a>
                        ))}

                        <a
                            href="#kontakt"
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
                        </a>
                    </div>
                </div>
            </header>

            <main className="pt-20">
                <Outlet />
            </main>
        </>
    )
}