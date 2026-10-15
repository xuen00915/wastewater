# Six-Page Wastewater Research Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the existing wastewater homepage into a production-quality six-page GitHub Pages website with shared navigation, restrained motion, and an interactive wastewater-treatment explainer.

**Architecture:** Keep React 19, TypeScript, Vite, and native CSS. Use Vite multi-page inputs for six clean HTML entry points, then let one shared React shell resolve the current `PageId` from `window.location.pathname`; typed page metadata supplies base-aware URLs, active navigation, titles, and page content. Reuse the existing visual components while moving detailed content into focused page components and adding one accessible interactive treatment pathway on Services.

**Tech Stack:** React 19, TypeScript 6, Vite 8 multi-page build, native CSS, Vitest, Testing Library, browser `IntersectionObserver`, Canvas 2D

**Spec:** `docs/superpowers/specs/2026-10-15-six-page-site-design.md`

## Global Constraints

- The primary site has exactly six pages: Home, Services, Research, Projects, Collaborate, and Career.
- Production URLs remain under `/wastewater/`; local development uses `/`.
- Do not add a client-side router, animation package, or other unnecessary dependency.
- Preserve Manrope, the approved navy/blue/aqua/green palette, representative imagery, and `public/images/IMAGE-SOURCES.md`.
- Do not fabricate organisation facts, contact details, vacancies, partners, results, statistics, savings, or scientific performance claims.
- Home keeps the floating 3D particles and a roughly 700-weight hero headline; particles do not appear on internal pages.
- Automatic motion must use transforms/opacity where possible and respect `prefers-reduced-motion`.
- All six pages must work at 1920, 1600, 1440, 1366, 1280, 1024, 768, 430, 390, and 360px without document-level horizontal overflow.
- Maintain semantic headings, visible focus states, 44px touch targets, keyboard operation, meaningful alt text, and WCAG AA contrast.

## Review Focus

- A production pathname with the `/wastewater/` base, a trailing slash, or an unknown suffix must resolve predictably without breaking Home.
- Every shared link must include the configured base exactly once in production and remain root-relative in local development.
- Mobile navigation must close on selection and Escape, return focus to its trigger, and identify the current page.
- Treatment stages must remain usable by mouse and keyboard with accurate selected-state semantics, including reduced-motion mode.
- Missing images, unsupported observers, short mobile landscape viewports, and repeated React Strict Mode setup/cleanup must not cause overflow, runtime errors, or leaked animation frames.

---

## File Structure

### HTML and build entries

- Modify `index.html` — Home document metadata and shared React mount.
- Create `services/index.html`, `research/index.html`, `projects/index.html`, `collaborate/index.html`, `career/index.html` — direct-loadable internal documents with unique titles and descriptions.
- Modify `vite.config.ts` — declare the six HTML inputs while retaining the conditional GitHub Pages base.

### Shared application and data

- Modify `src/main.tsx` — mount the shared application and install progressive page-transition behavior.
- Modify `src/App.tsx` — resolve and render the selected page inside the shared site shell.
- Create `src/site.ts` — `PageId`, typed page metadata, base-aware `pageHref`, and `resolvePageId`.
- Modify `src/data/content.ts` — page-aware links plus typed services, research, collaboration, career, and treatment-stage content.

### Shared and page components

- Create `src/components/SiteShell.tsx` — sentinel, shared Header, page `<main>`, and Footer.
- Modify `src/components/Header.tsx` — current-page active state and real page links.
- Modify `src/components/Footer.tsx` — real page links and removal of Home-only pseudo-destinations.
- Modify `src/components/Hero.tsx` — heavier headline, page links, and entrance choreography.
- Create `src/components/InternalPageHero.tsx` — compact reusable internal-page hero.
- Create `src/components/TreatmentPathway.tsx` — selectable, keyboard-accessible wastewater pathway.
- Modify existing section components only where needed to accept a preview/page variant or correct destinations.
- Create `src/pages/HomePage.tsx`, `ServicesPage.tsx`, `ResearchPage.tsx`, `ProjectsPage.tsx`, `CollaboratePage.tsx`, `CareerPage.tsx` — focused page compositions.

### Styling

- Modify `src/styles/tokens.css` — only shared tokens needed by multi-page heroes and motion.
- Modify `src/styles/global.css` — cross-document transition, page layout, and reduced-motion defaults.
- Modify `src/components/interactive-sections.css` — shared header, Home hero weight/entrance, process preview, and mobile navigation without layout-property animation.
- Modify `src/components/content-sections.css` — reusable section preview/page variants.
- Create `src/components/page-sections.css` — internal heroes and page-specific editorial layouts.
- Create `src/components/treatment-pathway.css` — horizontal/vertical interactive pathway and transform-based flow indicator.

### Tests

- Create `src/site.test.ts` — pathname resolution and production/local link construction.
- Modify `src/App.test.tsx` — six page compositions and content-integrity constraints.
- Modify `src/components/Header.test.tsx` — real links, active page, Escape, and selection behavior.
- Create `src/components/TreatmentPathway.test.tsx` — selection, keyboard, semantics, and generic-claim copy.
- Modify `src/components/ContentSections.test.tsx` — page destinations and honest placeholder states.
- Retain `src/components/ui/Floating3DParticles.test.tsx` — lifecycle, mobile quantity, and reduced-motion coverage.

---

### Task 1: Typed Page Model and Multi-Page Build

**Files:**
- Create: `src/site.ts`
- Create: `src/site.test.ts`
- Modify: `src/data/content.ts`
- Modify: `vite.config.ts`
- Modify: `index.html`
- Create: `services/index.html`
- Create: `research/index.html`
- Create: `projects/index.html`
- Create: `collaborate/index.html`
- Create: `career/index.html`

**Interfaces:**
- Produces: `type PageId = 'home' | 'services' | 'research' | 'projects' | 'collaborate' | 'career'`
- Produces: `sitePages: readonly SitePage[]`, where `SitePage` contains `id`, `label`, `segment`, `title`, and `description`
- Produces: `resolvePageId(pathname: string, base?: string): PageId`
- Produces: `pageHref(page: PageId, base?: string): string`
- Produces: `navItems: readonly NavItem[]`, where each item references a `PageId` rather than a hash

- [ ] **Step 1: Write failing routing tests**

Add tests named `resolves_all_six_local_and_production_paths`, `falls_back_to_home_for_unknown_paths`, and `builds_base_aware_page_links`. Assert `/`, `/services/`, `/wastewater/`, and `/wastewater/services/` map correctly; `/wastewater/unknown/` maps to `home`; production links contain `/wastewater/` exactly once; Home ends at the base root.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- --run src/site.test.ts`

Expected: FAIL because `src/site.ts` does not exist.

- [ ] **Step 3: Implement the typed page model**

Implement the exact interfaces above in `src/site.ts`. Normalize leading/trailing slashes and strip the supplied base before reading the first path segment. Update `navItems` and footer data in `src/data/content.ts` to consume `PageId` values; retain image URL generation with `import.meta.env.BASE_URL`.

- [ ] **Step 4: Add all six HTML documents and Vite inputs**

Give each document a unique title/meta description, the same `#root`, and `/src/main.tsx` module entry. In `vite.config.ts`, set `build.rollupOptions.input` to named absolute paths for `index.html` and the five nested HTML files; preserve `base: process.env.GITHUB_ACTIONS ? '/wastewater/' : '/'`.

- [ ] **Step 5: Verify routing tests and generated entries**

Run: `npm test -- --run src/site.test.ts && GITHUB_ACTIONS=true npm run build`

Expected: tests PASS and `dist/` contains `index.html` plus `services/index.html`, `research/index.html`, `projects/index.html`, `collaborate/index.html`, and `career/index.html`.

- [ ] **Step 6: Commit**

```bash
git add index.html services research projects collaborate career vite.config.ts src/site.ts src/site.test.ts src/data/content.ts
git commit -m "feat: add six-page site architecture"
```

### Task 2: Shared Shell, Navigation, and Footer

**Files:**
- Create: `src/components/SiteShell.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/Header.test.tsx`
- Modify: `src/components/ContentSections.test.tsx`

**Interfaces:**
- Consumes: `PageId`, `sitePages`, and `pageHref` from Task 1
- Produces: `SiteShell({ currentPage, children }: PropsWithChildren<{ currentPage: PageId }>)`
- Produces: `Header({ currentPage }: { currentPage: PageId })`
- Produces: `Footer()` using shared page metadata

- [ ] **Step 1: Write failing shared-navigation tests**

Assert that desktop and mobile navigation expose six real page URLs, the current link has `aria-current="page"`, no primary item uses a `#` destination, Escape closes the mobile menu and restores toggle focus, and selecting a mobile page link closes the menu. Assert Footer’s Career and Collaborate links reach their real pages and its Contact copy is plain availability text rather than a fake destination.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm test -- --run src/components/Header.test.tsx src/components/ContentSections.test.tsx`

Expected: FAIL because the current Header/Footer still use hash navigation and section observation.

- [ ] **Step 3: Implement `SiteShell` and page-aware Header**

Move the shared sentinel/Header/main/Footer composition to `SiteShell`. Remove section-based active-link observation from Header, derive active state from `currentPage`, use `pageHref`, retain sticky-scroll observation, Escape handling, `inert`, `aria-expanded`, and menu-close behavior.

- [ ] **Step 4: Convert Footer to page links**

Use `sitePages`/`pageHref` for Explore and Connect groups, link research-area labels to the Research page, keep the current-year output, and retain honest Careers/Contact availability copy without invented details.

- [ ] **Step 5: Verify shell tests**

Run: `npm test -- --run src/components/Header.test.tsx src/components/ContentSections.test.tsx`

Expected: PASS, including keyboard and current-page assertions.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/components/SiteShell.tsx src/components/Header.tsx src/components/Footer.tsx src/components/Header.test.tsx src/components/ContentSections.test.tsx
git commit -m "feat: add shared multi-page shell"
```

### Task 3: Focused Home Page and Internal Page Foundation

**Files:**
- Create: `src/components/InternalPageHero.tsx`
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/ServicesPage.tsx`
- Create: `src/pages/ResearchPage.tsx`
- Create: `src/pages/ProjectsPage.tsx`
- Create: `src/pages/CollaboratePage.tsx`
- Create: `src/pages/CareerPage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/ResearchPillars.tsx`
- Modify: `src/components/ProjectsSection.tsx`
- Modify: `src/components/CollaborationSection.tsx`
- Modify: `src/data/content.ts`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes: `PageId`, `pageHref`, typed content arrays, and `SiteShell`
- Produces: `InternalPageHero({ eyebrow, title, description, image, alt }: InternalPageHeroProps)`
- Produces: six parameterless page components with exactly one `<h1>` each
- Produces: `pageComponents: Record<PageId, ComponentType>` inside `App.tsx`
- Produces: typed `services`, `researchThemes`, `collaborationPathways`, and `careerAreas` content arrays

- [ ] **Step 1: Replace the single-page composition test with six failing page tests**

For each `PageId`, set `window.history` to its local pathname, render `<App />`, and assert exactly one H1 plus its unique page title. Assert Home contains its hero particles and only previews Research, Projects, and Collaborate; assert internal pages do not render the particle canvas. Keep the test that rejects invented email, phone, location, client, percentage, partner, vacancy, or result claims.

- [ ] **Step 2: Run the app tests and verify failure**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL because App still renders every section on Home and has no page map.

- [ ] **Step 3: Implement the reusable internal hero and six page compositions**

Use the approved headings/content from the spec and typed arrays from `src/data/content.ts`. Home includes Hero, Challenge, compact process preview, research preview, selected projects, and collaboration CTA. Services, Research, Projects, Collaborate, and Career each own their detailed content; Career states that opportunities will be published when available, and Projects keeps all entries explicitly replaceable/forthcoming.

- [ ] **Step 4: Update reusable sections and destinations**

Add only the minimal `variant`/limit props needed for Home previews versus full pages. Make Home Hero actions link to Research and Projects pages, research cards to Research, project preview to Projects, and collaboration actions to Collaborate. Set the Home H1 weight to `700` in CSS while preserving its current scale and emphasis colors.

- [ ] **Step 5: Verify all page compositions**

Run: `npm test -- --run src/App.test.tsx src/components/ContentSections.test.tsx`

Expected: PASS with exactly six page mappings, one H1 per page, no duplicated full-site Home, and no fabricated information.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/pages src/components/InternalPageHero.tsx src/components/Hero.tsx src/components/ResearchPillars.tsx src/components/ProjectsSection.tsx src/components/CollaborationSection.tsx src/data/content.ts src/App.test.tsx src/components/ContentSections.test.tsx
git commit -m "feat: compose six focused research pages"
```

### Task 4: Interactive Wastewater Treatment Pathway

**Files:**
- Create: `src/components/TreatmentPathway.tsx`
- Create: `src/components/TreatmentPathway.test.tsx`
- Create: `src/components/treatment-pathway.css`
- Modify: `src/data/content.ts`
- Modify: `src/pages/ServicesPage.tsx`

**Interfaces:**
- Produces: `type TreatmentStage = { id: string; number: string; title: string; summary: string; detail: string; icon: IconName }`
- Produces: `treatmentStages: readonly TreatmentStage[]` with five approved generic stages
- Produces: `TreatmentPathway()` with internal selected-stage state

- [ ] **Step 1: Write failing interaction tests**

Assert five stage buttons appear in ordered sequence; the first begins with `aria-selected="true"`; clicking another stage updates both `aria-selected` and the adjacent detail panel; ArrowRight/ArrowDown and ArrowLeft/ArrowUp move selection with wraparound; Home/End select boundary stages; each button remains focusable; copy describes a research pathway and does not claim a universal or proprietary treatment train.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- --run src/components/TreatmentPathway.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the accessible stage selector**

Render a labelled tablist-like stage control with five buttons and one live selected explanation panel. Use `aria-selected`, `aria-controls`, matching IDs, and keyboard handling for arrows/Home/End. Do not auto-advance stages.

- [ ] **Step 4: Implement responsive flow animation**

On desktop use a horizontal connected track; on mobile use a vertical track. Drive progress with a CSS custom property and transform-based scale, plus a restrained pseudo-element flow highlight. Under `prefers-reduced-motion`, remove transition/flow animation while leaving all stages and selection functional. Do not animate width, height, margin, or padding.

- [ ] **Step 5: Integrate into Services and verify**

Run: `npm test -- --run src/components/TreatmentPathway.test.tsx src/App.test.tsx`

Expected: PASS; Services exposes the interactive pathway and mobile semantics remain DOM-order correct.

- [ ] **Step 6: Commit**

```bash
git add src/components/TreatmentPathway.tsx src/components/TreatmentPathway.test.tsx src/components/treatment-pathway.css src/data/content.ts src/pages/ServicesPage.tsx
git commit -m "feat: add interactive treatment pathway"
```

### Task 5: Refined Motion and Responsive Page Styling

Before this task, read and apply the user-requested `gpt-taste` skill for motion choreography while preserving the approved visual direction and dependency constraints.

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/global.css`
- Modify: `src/components/interactive-sections.css`
- Modify: `src/components/content-sections.css`
- Create: `src/components/page-sections.css`
- Modify: `src/components/ui/Reveal.tsx`
- Modify: `src/components/ui/ui.test.tsx`
- Modify: `src/components/ui/Floating3DParticles.test.tsx`

**Interfaces:**
- Consumes: all page/component class names from Tasks 2–4
- Produces: progressive cross-document transitions using `@view-transition`/`view-transition-name` where supported
- Produces: transform/opacity hero staggering and observer-triggered reveals with safe no-observer fallback

- [ ] **Step 1: Add failing resilience tests**

Assert Reveal content stays visible when `IntersectionObserver` is unavailable, observer cleanup occurs under Strict Mode, particles cancel their animation frame and disconnect observers on unmount, and reduced-motion particles render a static frame without drift. Retain the existing missing-image fallback test and the short-viewport mobile-menu test; add an assertion that open navigation is vertically scrollable.

- [ ] **Step 2: Run focused tests and verify the new fallback assertion fails**

Run: `npm test -- --run src/components/ui/ui.test.tsx src/components/ui/Floating3DParticles.test.tsx src/components/Header.test.tsx`

Expected: at least the new Reveal fallback assertion FAILS before implementation.

- [ ] **Step 3: Implement page motion choreography**

Keep Floating3DParticles on Home only. Add a one-time hero eyebrow/title/body/actions/image stagger, subtle media hover zoom, section reveals, menu feedback, and progressive cross-document transitions. Fix the existing layout-transition hook finding by replacing any animated width/height/padding/margin with transforms/opacity; do not suppress the finding.

- [ ] **Step 4: Implement internal layouts and responsive states**

Style `InternalPageHero`, capability grids, research editorial blocks, projects, collaboration pathways, career opportunity areas, and TreatmentPathway. Add explicit 1024/768/430/390/360-safe behavior, stable media aspect ratios, mobile stacking, non-clipping headings, 44px controls, and short-landscape menu scrolling.

- [ ] **Step 5: Implement motion and observer fallbacks**

If IntersectionObserver is missing, render Reveal content visible immediately. Keep observer/frame cleanup idempotent under Strict Mode. Under `prefers-reduced-motion`, disable auto/stagger/flow/page-transition animation while preserving hover/focus state clarity and interaction.

- [ ] **Step 6: Run component and static checks**

Run: `npm test -- --run src/components/ui/ui.test.tsx src/components/ui/Floating3DParticles.test.tsx src/components/Header.test.tsx && npm run typecheck && npm run lint`

Expected: all tests PASS, TypeScript exits 0, ESLint exits 0, and the design hook reports no layout-property animation in changed CSS.

- [ ] **Step 7: Commit**

```bash
git add src/main.tsx src/styles src/components/interactive-sections.css src/components/content-sections.css src/components/page-sections.css src/components/ui/Reveal.tsx src/components/ui/ui.test.tsx src/components/ui/Floating3DParticles.test.tsx src/components/Header.test.tsx
git commit -m "feat: refine multi-page motion and responsive design"
```

### Task 6: Full Verification, Browser QA, and GitHub Pages Release

**Files:**
- Modify: `README.md`
- Modify: `public/robots.txt` only if its current base-path assumptions are incorrect
- Modify: implementation/test files only for defects found during verification

**Interfaces:**
- Consumes: complete six-page site
- Produces: a verified production build and deployed GitHub Pages URL

- [ ] **Step 1: Run the complete automated suite**

Run: `npm test -- --run && npm run typecheck && npm run lint && GITHUB_ACTIONS=true npm run build`

Expected: all tests PASS; typecheck/lint/build exit 0; build produces all six HTML entries with hashed shared assets.

- [ ] **Step 2: Inspect generated links and metadata**

Search `dist/**/*.html` for every unique title/description and `/wastewater/` asset paths. Verify no primary `href` begins with `#`, no URL contains `/wastewater/wastewater/`, and all nested HTML documents load the shared assets.

- [ ] **Step 3: Run local browser QA across all six pages**

At 1920, 1600, 1440, 1366, 1280, 1024, 768, 430, 390, and 360px, verify navigation, active state, menu keyboard behavior, treatment selection, scroll reveals, reduced motion, images, heading hierarchy, contrast, clipping, and document-level overflow. At minimum capture Home desktop/mobile and Services desktop/mobile screenshots for visual review.

- [ ] **Step 4: Fix and re-run checks for every discovered defect**

Use the systematic-debugging skill if any test, build, runtime, or layout issue appears. Re-run the focused failing check after each fix, then repeat the complete command from Step 1.

- [ ] **Step 5: Update project documentation**

Document the six URLs, local commands, GitHub Pages base behavior, page/content file locations, and replaceable image/data sources in `README.md`. Do not add organisation details that have not been supplied.

- [ ] **Step 6: Commit verification/documentation changes**

```bash
git add README.md public/robots.txt src index.html services research projects collaborate career vite.config.ts
git commit -m "docs: document six-page website"
```

- [ ] **Step 7: Perform final review and publish**

Use `superpowers:verification-before-completion`, then request one fresh whole-branch code review. After resolving valid findings and rerunning the complete suite, push `main`, wait for the GitHub Pages workflow, and verify these live URLs return the correct page:

```text
https://xuen00915.github.io/wastewater/
https://xuen00915.github.io/wastewater/services/
https://xuen00915.github.io/wastewater/research/
https://xuen00915.github.io/wastewater/projects/
https://xuen00915.github.io/wastewater/collaborate/
https://xuen00915.github.io/wastewater/career/
```

Expected: all six live pages load directly and through navigation with no console errors or missing assets.
