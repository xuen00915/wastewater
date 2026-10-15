# Six-Page Wastewater Research Website Design

**Date:** 2026-10-15  
**Status:** Approved design  
**Repository:** `xuen00915/wastewater`

## Purpose

Restructure the existing single-page wastewater treatment website into a true six-page research website. The result must preserve the established environmental research identity while making each primary navigation item a separate, directly loadable page.

The website remains aimed at research partners, universities, industry partners, building owners, government-related organisations, sustainability professionals, and prospective researchers or staff.

## Approved Page Set

1. **Home**
2. **Services**
3. **Research**
4. **Projects**
5. **Collaborate**
6. **Career**

## Architecture

Use Vite's multi-page application support instead of a client-side router. Each page has its own HTML entry point and clean GitHub Pages URL:

- `/wastewater/`
- `/wastewater/services/`
- `/wastewater/research/`
- `/wastewater/projects/`
- `/wastewater/collaborate/`
- `/wastewater/career/`

All entries load the same React application shell. The shell selects the correct page from the current pathname and renders shared navigation, footer, tokens, utilities, and motion behavior. This avoids hash URLs, avoids direct-refresh failures on GitHub Pages, and does not require a routing dependency.

The Vite build must declare all six HTML inputs. GitHub Pages deployment must publish every generated page and retain the existing `/wastewater/` base path.

## Shared Site Structure

Every page uses:

- The existing sticky responsive header and wordmark
- Real page links instead of anchor-only primary navigation
- An active navigation state derived from the pathname
- The existing dark navy footer, updated with page links
- Shared Manrope typography, color tokens, image handling, focus states, and spacing
- Shared compact internal-page hero components
- Shared reveal, media, card, section-heading, and CTA components

In-page anchors remain acceptable for secondary actions, but every primary navigation item must open its own page.

## Page Content

### Home

Home becomes a concise overview rather than the entire website.

It contains:

- The existing asymmetric hero with the floating particle field
- A heavier hero headline at approximately 700 font weight
- The challenge introduction
- A compact circular-process preview
- A research-area preview linking to Research
- A selected-project preview linking to Projects
- A collaboration CTA linking to Collaborate

Detailed service, research, project, collaboration, and career content must not be duplicated in full on Home.

### Services

Services explains practical capabilities without unsupported performance claims:

- Wastewater and liquid treatment
- Solid treatment and solids management
- Pilot testing
- Monitoring and learning
- Resource-recovery exploration
- Green-wall and building integration

It includes the interactive treatment pathway described below.

### Research

Research expands the connected research pillars:

- Liquid treatment
- Solid treatment
- Resource recovery
- Green-wall integration
- Monitoring and system learning

Content must describe research direction and methods without inventing findings, statistics, partners, or environmental savings.

### Projects

Projects contains the three existing neutral entries:

- Pilot Treatment Project
- Resource Recovery Study
- Green-Wall Integration Pilot

These remain clearly identified as replaceable project placeholders. No client names, locations, partners, numerical results, or unverifiable outcomes may be added. Project-detail actions remain unavailable until real project information exists.

### Collaborate

Collaborate explains three pathways:

- Industry partners
- Research partners
- Pilot sites

It includes expectations for collaboration and an honest contact-availability message until verified organisation contact details are supplied.

### Career

Career introduces the organisation's research-oriented working environment and relevant opportunity categories without advertising nonexistent vacancies. It may describe potential areas such as research, pilot systems, monitoring, environmental technology, and green infrastructure. The page must state that current opportunities will be published when available.

## Interactive Treatment Pathway

The Services page includes a focused “How Wastewater Treatment Works” explainer. It communicates a generic research pathway rather than a proprietary or universal treatment train.

Stages:

1. Wastewater enters the system
2. Liquid and solids move through treatment
3. Treatment performance is monitored
4. Useful resources are explored for recovery
5. Treated outputs connect with reuse and green-wall applications

Desktop behavior:

- Horizontal connected pathway
- A restrained water-flow indicator moves through the active portion of the line
- Selecting a stage updates an adjacent explanation panel
- Keyboard users can select every stage
- The active stage is visually and programmatically identified

Mobile behavior:

- Vertical pathway
- Full-width explanation beneath or beside the active stage
- No horizontal scrolling

Reduced-motion behavior:

- No flowing or automatic progression
- The full static pathway remains visible
- Stage selection still updates the explanation

## Visual Design

Preserve the established clean-water technology and circular-nature visual language:

- Deep navy, water blue, aqua, environmental green, pale blue, sage, and off-white
- Manrope typography
- Spacious editorial layouts
- Photographic water and green-infrastructure imagery
- Restrained radii and shadows
- High-contrast text tokens for accessible foreground use

The Home hero remains the visual signature. Its headline uses approximately 700 weight. Internal pages use shorter editorial heroes with unique titles, descriptions, and relevant imagery so pages feel related without repeating Home.

## Motion Design

Implementation will use the requested motion-design skill for choreography while retaining native CSS and existing browser APIs where sufficient.

Approved motion:

- Progressive cross-document page transitions where supported
- Staggered hero text and image entrance
- Floating 3D particles on Home only
- Scroll-triggered section reveals
- Treatment-pathway line and state transitions
- Subtle image zoom on hover
- Link, button, and navigation feedback
- Accessible mobile-menu transition

Do not use bouncing cards, scroll hijacking, heavy parallax, cursor effects, constant movement across every section, or layout-property animation. Animate transforms and opacity where possible. Every automatic animation must respect `prefers-reduced-motion`.

## Responsive Behavior

Verify all six pages at:

- 1920px
- 1600px
- 1440px
- 1366px
- 1280px
- 1024px
- 768px
- 430px
- 390px
- 360px

Requirements:

- No document-level horizontal overflow
- Desktop navigation changes to the accessible mobile menu at the existing breakpoint
- Multi-column content collapses naturally
- Treatment pathway becomes vertical on mobile
- Heading sizes remain readable without clipping
- Images use stable aspect ratios and `object-fit: cover`
- Touch targets remain at least 44px
- Short mobile landscape viewports can scroll open navigation content

## Accessibility

- Semantic landmarks and heading hierarchy on every page
- A unique title and meta description for every HTML entry
- Keyboard-accessible page navigation and treatment-stage selection
- Visible focus states
- Active-page indication using `aria-current="page"`
- Resolved `aria-labelledby` references
- Meaningful representative-image alt text
- Decorative animation hidden from assistive technology
- WCAG AA text and interactive-state contrast
- `prefers-reduced-motion` support

## Content and Data

Keep repeated content in typed arrays or page-content objects. Page components consume shared data instead of duplicating project, research, navigation, or collaboration information.

All existing imagery remains representative and replaceable. Preserve `public/images/IMAGE-SOURCES.md`. Do not fabricate organisation facts, contact information, vacancies, project partners, project outcomes, statistics, or scientific performance claims.

## Testing and Verification

Automated coverage must include:

- All six pathname-to-page mappings
- Clean page links under the production base path
- Active navigation and `aria-current`
- Direct loading of each generated HTML entry
- Mobile menu keyboard behavior
- Treatment-stage mouse and keyboard selection
- Particle and animation lifecycle cleanup
- Reduced-motion behavior
- Accessible section naming
- Lazy downstream images and eager Home hero media

Required commands:

```bash
npm test -- --run
npm run typecheck
npm run lint
GITHUB_ACTIONS=true npm run build
```

Browser verification must cover every requested viewport, page-specific navigation, live GitHub Pages paths, console errors, clipping, overflow, contrast, and motion behavior.

## Success Criteria

- The website contains exactly six primary pages.
- Primary navigation opens real pages, not sections on Home.
- Direct refresh works for all six GitHub Pages URLs.
- Home is concise and no longer contains every detailed section.
- The Services page clearly and interactively explains the wastewater research pathway.
- The Home hero uses the approved heavier headline and refined motion.
- All pages remain responsive, accessible, credible, and free of fabricated organisational or scientific information.
