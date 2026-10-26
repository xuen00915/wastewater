import { ButtonLink } from './ui/ButtonLink'
import { Reveal } from './ui/Reveal'
import { pageHref } from '../site'

export function FinalCta() {
  return <section className="final-cta section" id="final-cta" aria-labelledby="final-cta-title"><div className="final-cta__rings" aria-hidden="true"><i /><i /></div><Reveal className="container final-cta__inner"><h2 id="final-cta-title">Let’s Build Better<br />{' '}Water Systems Together</h2><p>Explore how research collaboration, pilot testing and environmental monitoring can support more circular water systems.</p><div><ButtonLink href={pageHref('collaborate')}>Collaborate With Us</ButtonLink><ButtonLink href={pageHref('research')} variant="secondary">View Our Research</ButtonLink></div></Reveal></section>
}
