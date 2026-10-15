import { footerGroups } from '../data/content'

export function Footer() {
  return <footer className="site-footer" id="footer"><div className="container site-footer__grid"><div className="site-footer__brand"><a className="footer-wordmark" href="#home"><span aria-hidden="true" />Wastewater Treatment</a><p>Advancing wastewater treatment, resource recovery and green infrastructure research for more sustainable built environments.</p></div>{footerGroups.map((group) => <nav key={group.title} aria-label={`${group.title} footer links`}><h3>{group.title}</h3>{group.links.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}</nav>)}</div><div className="container site-footer__bottom"><p>© {new Date().getFullYear()} Wastewater Treatment</p><p>All rights reserved</p></div></footer>
}
