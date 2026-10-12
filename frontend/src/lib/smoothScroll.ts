import type Lenis from 'lenis'

let homeLenis: Lenis | null = null

export function setHomeLenis(lenis: Lenis | null) {
    homeLenis = lenis
}

export function scrollToHomeSection(id: string, offset = 104) {
    const section = document.getElementById(id)
    if (!section) return false

    if (homeLenis) {
        homeLenis.scrollTo(section, { offset: -offset })
    } else {
        const top = section.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    }

    return true
}
