import { useEffect, useRef, useState } from 'react'
import { navItems } from '../data/content'
import { pageHref, type PageId } from '../site'
import { ButtonLink } from './ui/ButtonLink'

const headerNavItems = navItems.filter(({ page }) => page !== 'home')

export function Header({ currentPage }: { currentPage: PageId }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 24)
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
    <header className={`site-header${currentPage === 'home' ? ' site-header--home' : ''}${scrolled ? ' site-header--scrolled' : ''}`}>
      <div className="site-header__inner">
        <a className="wordmark" href={pageHref('home')} aria-label="E & ST Environmental home">
          <span>E & ST <strong>Environmental</strong></span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {headerNavItems.map((item) => <a key={item.page} className={currentPage === item.page ? 'active' : ''} href={pageHref(item.page)} aria-current={currentPage === item.page ? 'page' : undefined}>{item.label}</a>)}
        </nav>
        <ButtonLink className="header-cta" href={pageHref('collaborate')}>Collaborate With Us</ButtonLink>
        <button ref={menuToggleRef} className={`menu-toggle${menuOpen ? ' menu-toggle--open' : ''}`} type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-controls="mobile-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          <span /><span />
        </button>
      </div>
      <nav id="mobile-navigation" aria-label="Mobile navigation" aria-hidden={!menuOpen} inert={!menuOpen} className={`mobile-nav${menuOpen ? ' mobile-nav--open' : ''}`} style={{ overflowY: 'auto' }}>
        {headerNavItems.map((item) => <a key={item.page} href={pageHref(item.page)} aria-current={currentPage === item.page ? 'page' : undefined} onClick={closeMenu}>{item.label}</a>)}
        <ButtonLink href={pageHref('collaborate')} onClick={closeMenu}>Collaborate With Us</ButtonLink>
      </nav>
    </header>
  )
}
