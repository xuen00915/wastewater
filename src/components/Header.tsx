import { useEffect, useRef, useState } from 'react'
import { navItems } from '../data/content'
import { resolvePageId } from '../site'
import { ButtonLink } from './ui/ButtonLink'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 24)
  const active = resolvePageId(typeof window === 'undefined' ? '/' : window.location.pathname)
  const menuToggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const sentinel = document.querySelector('.page-top-sentinel')
    if (!sentinel || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), { threshold: 0 })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
        menuToggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={`site-header${scrolled ? ' site-header--scrolled' : ''}`}>
      <div className="site-header__inner">
        <a className="wordmark" href="#home" aria-label="Wastewater Treatment home">
          <span className="wordmark__mark" aria-hidden="true"><i /><i /></span>
          <span>Wastewater <strong>Treatment</strong></span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => <a key={item.href} className={active === item.page ? 'active' : ''} href={item.href}>{item.label}</a>)}
        </nav>
        <ButtonLink className="header-cta" href="#collaborate">Collaborate With Us</ButtonLink>
        <button ref={menuToggleRef} className={`menu-toggle${menuOpen ? ' menu-toggle--open' : ''}`} type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-controls="mobile-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          <span /><span />
        </button>
      </div>
      <nav id="mobile-navigation" aria-label="Mobile navigation" aria-hidden={!menuOpen} inert={!menuOpen} className={`mobile-nav${menuOpen ? ' mobile-nav--open' : ''}`}>
        {navItems.map((item) => <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>)}
        <ButtonLink href="#collaborate" onClick={closeMenu}>Collaborate With Us</ButtonLink>
      </nav>
    </header>
  )
}
