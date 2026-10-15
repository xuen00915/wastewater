import { footerGroups } from '../data/content'
import { pageHref } from '../site'

export function Footer() {
  return <footer className="site-footer" id="footer"><div className="container site-footer__grid"><div className="site-footer__brand"><a className="footer-wordmark" href={pageHref('home')}><span aria-hidden="true" />Wastewater Treatment</a><p>Advancing wastewater treatment, resource recovery and green infrastructure research for more sustainable built environments.</p><p className="site-footer__availability"><strong>Careers</strong><span>Opportunities will be published on our Career page when available.</span></p><p className="site-footer__availability" id="contact-availability"><strong>Contact</strong><span>Contact details will be published here when available.</span></p></div>{footerGroups.map((group) => <nav key={group.title} aria-label={`${group.title} footer links`}><h3>{group.title}</h3>{group.links.map((link) => <a key={link.label} href={pageHref(link.page)}>{link.label}</a>)}</nav>)}</div><div className="container site-footer__bottom"><p>© {new Date().getFullYear()} Wastewater Treatment</p><p>All rights reserved</p></div></footer>
}
