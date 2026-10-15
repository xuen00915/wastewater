# Wastewater Treatment Homepage Design

## Purpose

Create the first production-quality homepage for a new environmental research website. The page positions wastewater treatment, resource recovery, and green-wall integration as one circular pathway from wastewater to greener buildings. It must feel credible to research, government, industry, building, and sustainability audiences without making unsupported scientific or project claims.

The temporary organisation name and wordmark are **Wastewater Treatment** until a real name and identity are supplied.

## Technical Approach

The repository is empty, so the homepage will establish a small React application using Vite and TypeScript. It will use React Router-compatible hash-free anchor navigation on the single homepage and custom CSS rather than a component framework. GitHub Actions will build and publish `dist/` to GitHub Pages with Vite's repository-aware base path.

Dependencies will stay minimal: React, React DOM, Vite, TypeScript, ESLint, and the React Vite plugin. Icons will be compact, reusable inline SVG React components so the visual language remains consistent without adding an icon package.

## Visual System

- Maximum content width: 1400px.
- Desktop/tablet/mobile gutters: 56px / 30px / 20px.
- Manrope is loaded as the preferred web font with a robust system fallback.
- Core palette follows the supplied navy, water blue, aqua, green, sage, pale blue, off-white, and text colours exactly.
- Main surfaces alternate between true white, pale blue, light sage, and one deep navy editorial band.
- Hero and section titles use controlled responsive `clamp()` scales. Headings use medium-to-semibold weights rather than uniformly heavy typography.
- Cards use 16–20px radii; primary media uses 20–28px radii; pills are reserved for buttons.
- Fine rules, open layouts, large photography frames, and subtle water contour lines provide the visual identity. There is no glassmorphism, dense dashboard styling, or gradient-heavy treatment.

## Page Structure

1. **Header and hero:** sticky transparent-to-white header, minimal navigation, mobile menu, asymmetric 45/55 hero, temporary photo frame, circular-system information card, two calls to action.
2. **Challenge:** editorial split with section number, two paragraphs, and three open mini-statements for Treat, Recover, and Reuse.
3. **Core process:** five-stage wastewater-to-building pathway connected by a continuous line. Horizontal on desktop and vertical on mobile.
4. **Research pillars:** three image-led editorial cards for liquid treatment, solid treatment, and green wall.
5. **Research into application:** deep navy architectural band with a green-wall image and three structured rows.
6. **Why it matters:** four open benefit columns with number/rule treatment and no invented metrics.
7. **Projects:** three data-driven neutral project placeholders with type and status fields.
8. **Collaboration:** pale-sage split layout with three collaboration categories.
9. **Final CTA and footer:** concise closing invitation followed by a four-column deep-navy footer.

## Component Architecture

- `App`: page composition only.
- `Header`: sticky state, active-section indication, desktop nav, accessible mobile menu.
- `SectionHeading`: reusable label/title/description treatment.
- `Hero`, `ChallengeSection`, `ProcessSection`, `ResearchPillars`, `EditorialFeature`, `BenefitsSection`, `ProjectsSection`, `CollaborationSection`, `FinalCta`, and `Footer`: focused page sections.
- `ButtonLink`, `Icon`, `MediaPlaceholder`, and `Reveal`: shared UI primitives.
- `content.ts`: navigation, process, research pillar, benefit, project, collaboration, and footer data.

The component boundaries allow copy and real project data to be swapped later without restructuring the page.

## Interaction Model

- Header gains a white surface, fine border, and low shadow after scrolling.
- Mobile navigation opens from the header, traps no content, closes on link selection or Escape, and exposes correct expanded state.
- Active navigation updates as the user enters major anchored sections.
- Sections fade and translate slightly once when entering the viewport.
- The process line fills once when the section enters view; stages respond to hover and keyboard focus with a restrained colour/state change.
- Research and project media zoom by approximately 2–3% on hover; borders and links strengthen without card lift or bounce.
- All links and controls have visible keyboard focus states and at least 44px touch targets.
- `prefers-reduced-motion` disables reveal movement, line animation, smooth scrolling, and image scaling.

## Responsive Behaviour

- Hero remains split at large widths, reduces scale at 1280–1024px, and stacks copy above media below tablet width.
- Editorial two-column sections stack when their reading order benefits from it.
- The process becomes a vertical rail on mobile with the continuous line at the left.
- Three-column research/project cards stack to one column; four benefit blocks become two columns on tablet and one column on mobile.
- Navigation converts to a menu below 900px.
- Layout will be checked at 1920, 1600, 1440, 1366, 1280, 1024, 768, 430, 390, and 360px, with particular attention to overflow, headline wrapping, image crops, and touch targets.

## Images and Content Integrity

The generated files in `docs/design-concepts/` are design references only. They are not presented as real projects, results, client sites, or partner work. Production media areas will use clearly replaceable, non-claiming environmental image assets with central paths:

- `/images/home-hero-wastewater.webp`
- `/images/research-liquid-treatment.webp`
- `/images/research-solid-treatment.webp`
- `/images/research-green-wall.webp`
- `/images/home-green-wall.webp`

If suitable rights-cleared images cannot be sourced for the initial deployment, a consistent `MediaPlaceholder` will show the intended subject and required filename without fabricating project photography.

No client names, locations, partners, statistics, environmental savings, addresses, phone numbers, email addresses, or research results will be invented.

## Accessibility and Semantics

The page uses a single `h1`, sequential section headings, landmark elements, labelled navigation, meaningful link text, decorative SVGs hidden from assistive technology, descriptive media alt text, keyboard-accessible controls, visible focus states, and sufficient contrast. The menu button uses `aria-expanded` and `aria-controls`. Motion preferences are respected.

## Validation

- Run type checking, linting, and a production build.
- Serve the built site and inspect it in a browser.
- Test header state, mobile menu, anchor navigation, active section state, and process/reveal behavior.
- Capture desktop, tablet, and mobile screenshots and compare them with the design references.
- Audit overflow, clipping, line wrapping, spacing, contrast, image aspect ratio, and reduced-motion behaviour.
- Verify GitHub Pages deployment configuration and repository-relative asset paths.

## Visual References

The accepted direction is represented by nine coordinated section concepts stored under `docs/design-concepts/`: hero, challenge, process, research pillars, editorial feature, benefits, projects, collaboration, and final CTA/footer.
