import { footerGroups } from '../data/content'
import { pageHref } from '../site'

export function Footer() {
  return <footer className="site-footer" id="footer"><div className="container site-footer__grid"><div className="site-footer__brand"><a className="footer-wordmark" href={pageHref('home')}>E &amp; ST Environmental</a><p>Connecting wastewater treatment, resource recovery and living systems to support more circular and resilient environments.</p></div>{footerGroups.map((group) => <nav key={group.title} aria-label={`${group.title} footer links`}><h3>{group.title}</h3>{group.links.map((link) => <a key={link.label} href={pageHref(link.page)}>{link.label}</a>)}</nav>)}</div><div className="container site-footer__bottom"><p>© {new Date().getFullYear()} E &amp; ST Environmental</p><p>All rights reserved</p></div></footer>
}
