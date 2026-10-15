# Wastewater Treatment Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish an interactive, responsive environmental-research homepage that communicates the wastewater-to-greener-buildings pathway.

**Architecture:** A Vite React TypeScript single-page application composes focused section components from typed content data and shared UI primitives. Custom CSS provides the complete design system and responsive behavior; browser-native observers drive sticky navigation, section reveals, active anchors, and the process-line animation. A GitHub Actions workflow deploys the production build to GitHub Pages.

**Tech Stack:** React 19, TypeScript, Vite, custom CSS, Vitest, Testing Library, GitHub Actions / Pages

**Spec:** `docs/superpowers/specs/2026-10-15-homepage-design.md`

## Global Constraints

- Use the temporary organisation name **Wastewater Treatment**.
- Preserve the supplied section order, visible copy, palette, and 1400px container model.
- Do not invent partners, clients, locations, metrics, environmental savings, contact details, or scientific results.
- Do not represent generated concept imagery as real project photography.
- Keep all repeated content in typed arrays and keep `App` as composition glue.
- Use custom CSS and compact inline SVG icon components; do not add a UI framework or icon package.
- Support the specified desktop, tablet, and mobile widths without horizontal overflow.
- All navigation and interactive states must work with keyboard input and reduced-motion preferences.
- GitHub Pages assets must resolve correctly below `/wastewater/`.

## Review Focus

- At 360px wide, the hero heading, mobile menu, process rail, and card content remain fully visible with no horizontal overflow; covered in Task 5 viewport assertions.
- With JavaScript observers unavailable, content remains visible and navigation links remain usable; covered in Task 3 fallback tests.
- With `prefers-reduced-motion: reduce`, reveals, smooth scrolling, process progress, and image zoom stop animating; covered in Task 3 CSS assertions.
- Keyboard users can open/close the mobile menu, dismiss it with Escape, see focus, and focus each process stage; covered in Task 3 interaction tests.
- On GitHub Pages, routes, styles, fonts, and local images resolve below `/wastewater/`; covered in Task 5 production-preview checks.

---

### Task 1: Project Foundation and Design Tokens

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `eslint.config.js`
- Create: `src/main.tsx`
- Create: `src/vite-env.d.ts`
- Create: `src/styles/reset.css`
- Create: `src/styles/tokens.css`
- Create: `src/test/setup.ts`

**Interfaces:**
- Produces: Vite entry point, `npm run dev`, `npm run test`, `npm run lint`, `npm run typecheck`, and `npm run build`; global CSS tokens used by all later tasks.

- [ ] **Step 1: Define project scripts and dependencies**

Create the React/Vite/TypeScript package with Vitest + Testing Library test support and no runtime dependency beyond React and React DOM.

- [ ] **Step 2: Configure Vite and TypeScript**

Set the production base to `/wastewater/` only during GitHub Actions builds and `/` locally; configure jsdom tests and strict TypeScript.

- [ ] **Step 3: Add the document shell and CSS foundations**

Load Manrope from Google Fonts with system fallbacks, add the exact colour/spacing/type/radius tokens from the spec, and set accessible reset defaults including `box-sizing`, focus visibility, and responsive media.

- [ ] **Step 4: Verify the foundation**

Run: `npm install && npm run typecheck && npm run lint && npm run build`

Expected: all commands exit 0 and `dist/index.html` exists.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json index.html tsconfig*.json vite.config.ts eslint.config.js src
git commit -m "chore: scaffold wastewater research site"
```

### Task 2: Typed Content and Shared UI

**Files:**
- Create: `src/data/content.ts`
- Create: `src/components/ui/Icon.tsx`
- Create: `src/components/ui/ButtonLink.tsx`
- Create: `src/components/ui/SectionHeading.tsx`
- Create: `src/components/ui/MediaPlaceholder.tsx`
- Create: `src/components/ui/Reveal.tsx`
- Create: `src/components/ui/ui.css`
- Create: `src/components/ui/ui.test.tsx`

**Interfaces:**
- Produces: typed `navItems`, `processStages`, `researchAreas`, `benefits`, `projects`, `collaborationTypes`, and `footerGroups`; `Icon({name})`, `ButtonLink`, `SectionHeading`, `MediaPlaceholder`, and `Reveal` components.
- Consumes: global tokens from Task 1.

- [ ] **Step 1: Write shared UI tests**

Assert that `ButtonLink` preserves its `href` and variant, `SectionHeading` renders the configured heading level, `MediaPlaceholder` exposes descriptive accessible text and its replaceable filename, and `Reveal` renders children visibly before observer enhancement.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- --run src/components/ui/ui.test.tsx`

Expected: FAIL because the shared components do not exist.

- [ ] **Step 3: Add typed content models and exact homepage copy**

Define discriminated icon names and readonly arrays so sections map content without duplicating markup. Keep all project entries explicitly neutral and non-client-specific.

- [ ] **Step 4: Implement shared UI primitives**

Use inline SVG with `currentColor`, semantic links/headings, an image element that gracefully falls back to a labelled media placeholder when the configured local asset is unavailable, and observer-enhanced reveal behavior.

- [ ] **Step 5: Run shared UI tests**

Run: `npm test -- --run src/components/ui/ui.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/data src/components/ui
git commit -m "feat: add typed content and shared homepage UI"
```

### Task 3: Header, Hero, and Core Interactive Pathway

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/Hero.tsx`
- Create: `src/components/ChallengeSection.tsx`
- Create: `src/components/ProcessSection.tsx`
- Create: `src/components/interactive-sections.css`
- Create: `src/components/Header.test.tsx`
- Create: `src/components/ProcessSection.test.tsx`

**Interfaces:**
- Produces: `Header`, `Hero`, `ChallengeSection`, and `ProcessSection` with sticky/active/mobile and observer-driven process behavior.
- Consumes: Task 2 content and UI primitives.

- [ ] **Step 1: Write navigation and process interaction tests**

Assert that the mobile menu toggles `aria-expanded`, closes on Escape and navigation selection, header scroll state can update, all five stages are keyboard-focusable, and process content remains rendered when `IntersectionObserver` is absent.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- --run src/components/Header.test.tsx src/components/ProcessSection.test.tsx`

Expected: FAIL because the interactive components do not exist.

- [ ] **Step 3: Implement the sticky accessible header**

Track scroll and visible sections with lightweight hooks, render the requested desktop nav and CTA, and implement a labelled mobile menu button with Escape handling and focus-visible states.

- [ ] **Step 4: Implement hero and challenge sections**

Match the approved asymmetric composition, exact supplied copy, water-contour decoration, circular-system card, and open three-statement challenge layout.

- [ ] **Step 5: Implement the responsive process pathway**

Render five focusable stages from `processStages`, one continuous progress line, an intersection-triggered active class, horizontal desktop and vertical mobile layouts, and no bounce/parallax.

- [ ] **Step 6: Add reduced-motion and no-observer fallbacks**

Ensure content defaults visible and CSS disables smooth scrolling, reveal transforms, progress animation, and image zoom under `prefers-reduced-motion`.

- [ ] **Step 7: Run interaction tests**

Run: `npm test -- --run src/components/Header.test.tsx src/components/ProcessSection.test.tsx`

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/components/Header* src/components/Hero.tsx src/components/ChallengeSection.tsx src/components/ProcessSection* src/components/interactive-sections.css
git commit -m "feat: build interactive homepage introduction"
```

### Task 4: Remaining Homepage Sections and Composition

**Files:**
- Create: `src/components/ResearchPillars.tsx`
- Create: `src/components/EditorialFeature.tsx`
- Create: `src/components/BenefitsSection.tsx`
- Create: `src/components/ProjectsSection.tsx`
- Create: `src/components/CollaborationSection.tsx`
- Create: `src/components/FinalCta.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/components/content-sections.css`
- Create: `src/App.tsx`
- Create: `src/App.test.tsx`
- Create: `src/styles/global.css`

**Interfaces:**
- Produces: complete homepage `App` and all downstream sections.
- Consumes: all Task 2 data/primitives and Task 3 introductory components.

- [ ] **Step 1: Write homepage composition tests**

Assert one `h1`, required section headings in order, three research areas, four benefits, three neutral project entries with type/status, three collaboration rows, the current year, and absence of fabricated contact/client/location content.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL because the composed page does not exist.

- [ ] **Step 3: Implement research, editorial, and benefits sections**

Map typed data into the photographic editorial-card family, the deep-navy living-systems band, and the open four-column benefits rail. Preserve exact copy and restrained image-hover behavior.

- [ ] **Step 4: Implement projects and collaboration sections**

Keep project data replaceable and explicitly provisional; use type/status fields without fake specifics. Render collaboration as open stacked rows rather than generic cards.

- [ ] **Step 5: Implement final CTA, footer, and page composition**

Compose every section in the approved order, use only the requested navigation/footer items, and render `new Date().getFullYear()` for copyright.

- [ ] **Step 6: Implement responsive section styling**

Add wide, tablet, and mobile grid transitions; use `overflow-wrap`, `min-width: 0`, stable media aspect ratios, and section-specific spacing so no section depends on a forced desktop layout.

- [ ] **Step 7: Run the homepage tests**

Run: `npm test -- --run src/App.test.tsx`

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/App* src/components src/styles/global.css
git commit -m "feat: complete environmental research homepage"
```

### Task 5: Rights-Cleared Media, Deployment, and Visual QA

**Files:**
- Create: `public/images/home-hero-wastewater.webp`
- Create: `public/images/research-liquid-treatment.webp`
- Create: `public/images/research-solid-treatment.webp`
- Create: `public/images/research-green-wall.webp`
- Create: `public/images/home-green-wall.webp`
- Create: `public/images/project-pilot-treatment.webp`
- Create: `public/images/project-resource-recovery.webp`
- Create: `public/images/project-green-wall.webp`
- Create: `public/images/IMAGE-SOURCES.md`
- Create: `.github/workflows/deploy-pages.yml`
- Create: `README.md`

**Interfaces:**
- Produces: deployable GitHub Pages build, documented replaceable media set, and verified visual implementation.
- Consumes: complete Task 4 application.

- [ ] **Step 1: Source and document non-project environmental images**

Select rights-cleared images depicting wastewater infrastructure, water research, solids/materials work, and green-wall architecture. Download stable local WebP assets, document creator/source/license links in `IMAGE-SOURCES.md`, and describe them as representative imagery rather than organisation projects.

- [ ] **Step 2: Add GitHub Pages deployment**

Configure checkout, Node setup, `npm ci`, build, Pages artifact upload, and deployment on pushes to `main`, with `pages: write` and `id-token: write` permissions.

- [ ] **Step 3: Add project documentation**

Document local commands, GitHub Pages activation, temporary organisation copy, content-data locations, and every image path that should later be replaced with real organisation media.

- [ ] **Step 4: Run the full automated verification suite**

Run: `npm test -- --run && npm run typecheck && npm run lint && npm run build`

Expected: all commands exit 0 with no test, TypeScript, lint, or build errors.

- [ ] **Step 5: Run production preview and browser checks**

Serve `dist/`, inspect in Browser/IAB, and capture 1440px, 768px, and 390px screenshots. Exercise sticky header, mobile menu, anchor links, process stage focus, line/reveal behavior, image fallbacks, and CTA links.

- [ ] **Step 6: Audit every requested viewport**

Use browser viewport checks at 1920, 1600, 1440, 1366, 1280, 1024, 768, 430, 390, and 360px. Assert `document.documentElement.scrollWidth <= window.innerWidth` and inspect headline wrapping, menu bounds, media crops, section spacing, contrast, and footer stacking.

- [ ] **Step 7: Compare implementation with visual references**

Use `view_image` on the relevant files in `docs/design-concepts/` and the newest browser screenshots in one QA pass. Record at least five fidelity checks covering copy, layout, typography, palette, image treatment, spacing/container model, responsive behavior, and motion; fix all material differences.

- [ ] **Step 8: Commit**

```bash
git add public .github README.md src
git commit -m "chore: add media, deployment, and responsive polish"
```

- [ ] **Step 9: Verify final repository state**

Run: `git status --short --branch && git log --oneline --decorate -6`

Expected: clean `main` branch with the design, foundation, homepage, and deployment commits present.
