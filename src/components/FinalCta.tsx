import { ButtonLink } from './ui/ButtonLink'
import { Reveal } from './ui/Reveal'

export function FinalCta() {
  return <section className="final-cta section" id="final-cta" aria-labelledby="final-cta-title"><div className="final-cta__rings" aria-hidden="true"><i /><i /></div><Reveal className="container final-cta__inner"><h2 id="final-cta-title">Let’s Build Better<br />{' '}Water Systems Together</h2><p>Interested in research collaboration, pilot testing or sustainable water applications? Start a conversation with our team.</p><div><ButtonLink href="#collaborate">Collaborate With Us</ButtonLink><ButtonLink href="#research" variant="secondary">View Our Research</ButtonLink></div></Reveal></section>
}
