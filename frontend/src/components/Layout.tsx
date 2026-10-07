import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../assets/Urban.png'
import { clearSession, getSession } from '../lib/session.ts'

const navItems = [
    { label: 'O nama', id: 'o-nama' },
    { label: 'Naš tim', id: 'nas-tim' },
    { label: 'Usluge', id: 'usluge' },
    { label: 'Kontakt', id: 'kontakt' },
]

export default function Layout() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('')
    const [session, setSession] = useState(getSession())
    const navigate = useNavigate()
    const location = useLocation()

    const handleSectionNavigation = (id: string) => {
        const hash = `#${id}`

        setMenuOpen(false)

        if (location.pathname === '/' && location.hash === hash) {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            return
        }

        navigate({ pathname: '/', hash })
    }

    useEffect(() => setSession(getSession()), [location.pathname])

    useEffect(() => {
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

        const observedSections = new Set<HTMLElement>()
        const observeSections = () => {
            navItems.forEach(({ id }) => {
                const section = document.getElementById(id)

                if (section && !observedSections.has(section)) {
                    observedSections.add(section)
                    sectionObserver.observe(section)
                }
            })
        }

        observeSections()

        // The Outlet's route content can mount after Layout, so observe added sections too.
        const sectionMutationObserver = new MutationObserver(observeSections)
        sectionMutationObserver.observe(document.body, { childList: true, subtree: true })

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
            sectionMutationObserver.disconnect()
            revealObserver.disconnect()
        }
    }, [location.pathname])

    useEffect(() => {
        if (location.pathname !== '/' || !location.hash) {
            return
        }

        const sectionId = location.hash.slice(1)
        let animationFrame: number | undefined

        const scrollToSection = () => {
            const section = document.getElementById(sectionId)

            if (!section) {
                return false
            }

            animationFrame = requestAnimationFrame(() => {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' })
            })
            return true
        }

        if (scrollToSection()) {
            return () => {
                if (animationFrame !== undefined) {
                    cancelAnimationFrame(animationFrame)
                }
            }
        }

        const homeMutationObserver = new MutationObserver(() => {
            if (scrollToSection()) {
                homeMutationObserver.disconnect()
            }
        })
        homeMutationObserver.observe(document.body, { childList: true, subtree: true })

        return () => {
            homeMutationObserver.disconnect()
            if (animationFrame !== undefined) {
                cancelAnimationFrame(animationFrame)
            }
        }
    }, [location.hash, location.pathname])

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
                        href="/"
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
                group-hover:scale-[1.03]"/>
                    </a>

                    <div className="hidden items-center gap-10 md:flex">
                        {navItems.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={(event) => {
                                    event.preventDefault()
                                    handleSectionNavigation(item.id)
                                }}
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

                    <div className="hidden items-center gap-4 justify-self-end md:flex">
                    <Link
                        to="/book"
                        className="
            group relative hidden
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
                    </Link>

                        {session ? <>
                            <Link to={session.user.role === 'BARBER' ? '/barber' : '/profile'} className="text-sm text-white/75 hover:text-white">
                                {session.user.role === 'BARBER' ? 'Dashboard' : 'Profil'}
                            </Link>
                            <button onClick={() => { clearSession(); setSession(null); navigate('/'); }} className="text-sm text-white/50 hover:text-white">Odjava</button>
                        </> : <Link to="/account" className="text-sm text-white/75 hover:text-white">Prijava</Link>}
                    </div>


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
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={(event) => {
                                    event.preventDefault()
                                    handleSectionNavigation(item.id)
                                }}
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

                        <Link
                            to="/book"
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
                        </Link>
                        {session ? <><Link to={session.user.role === 'BARBER' ? '/barber' : '/profile'} onClick={() => setMenuOpen(false)} className="mt-4 py-3 text-sm text-white/70">{session.user.role === 'BARBER' ? 'Dashboard' : 'Profil'}</Link><button onClick={() => { clearSession(); setSession(null); setMenuOpen(false); navigate('/'); }} className="py-3 text-left text-sm text-white/70">Odjava</button></> : <Link to="/account" onClick={() => setMenuOpen(false)} className="mt-4 py-3 text-sm text-white/70">Prijava / Registracija</Link>}
                    </div>
                </div>
            </header>

            <main className="pt-20">
                <Outlet />
            </main>
        </>
    )
}
