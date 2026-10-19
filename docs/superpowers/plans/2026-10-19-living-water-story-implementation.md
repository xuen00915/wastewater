# Living Water Portal-to-Waterline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one continuous homepage scroll story that morphs an organic wastewater portal into a full-width waterline scene and then clears into the existing first content section.

**Architecture:** Replace the current full-background hero plus separate static transition scene with a single sticky `WaterStoryScroll`. One passive, requestAnimationFrame-throttled controller writes normalized progress and derived CSS variables directly to the story root and updates one SVG mask path; focused child components own the portal interaction and underwater presentation.

**Tech Stack:** React 19, TypeScript 6, Vite 8, vanilla CSS, SVG, lightweight 2D canvas, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-19-living-water-story-design.md`

## Global Constraints

- Use `/images/home-hero-wastewater.webp` as the only required story image.
- Do not add runtime dependencies, WebGL, Three.js, or GSAP.
- Do not update React state during scrolling.
- Use one passive scroll listener and requestAnimationFrame for progress writes.
- Cap every canvas at device pixel ratio `2`.
- Preserve the responsive header, routes, global `WaterRippleTrail`, and `NavigationWaterTransition`.
- Keep all factual content and CTA destinations unchanged.
- Keep the desktop sticky story around `190–210vh` and mobile around `140–160vh`.
- Respect `prefers-reduced-motion: reduce` with no extended sticky animation.
- Preserve unrelated working-tree changes and the existing untracked `deploy/` directory.

## Review Focus

- Browsers without `matchMedia`, `ResizeObserver`, or `IntersectionObserver` must render usable static content and clean up listeners without throwing; Task 2 tests these fallbacks.
- Direct navigation to a scrolled position or browser restoration must paint the correct story progress on mount; Task 2 tests non-zero initial `scrollY`.
- Resizing across desktop/mobile breakpoints must recalculate the scroll range without producing progress outside `0–1`; Task 2 tests resize recalculation.
- Pointer interaction outside the visible portal must not create portal ripples, while an exact point inside it must; Task 4 tests both cases.
- Image-loading delay must show the navy background without a white flash and the next section must remain reachable at progress `1`; Task 6 verifies both in the browser.

---

## File Structure

### Create

- `src/components/water-story/waterStoryMath.ts` — pure progress, interpolation, and SVG path helpers.
- `src/components/water-story/waterStoryMath.test.ts` — interpolation and stage-boundary tests.
- `src/components/water-story/WaterStoryScroll.tsx` — sticky wrapper and single scroll controller.
- `src/components/water-story/WaterStoryScroll.test.tsx` — listener, fallback, reduced-motion, and cleanup tests.
- `src/components/water-story/LivingWaterPortal.tsx` — accessible SVG-clipped image and water-edge layers.
- `src/components/water-story/LivingWaterPortal.test.tsx` — portal structure and image semantics.
- `src/components/water-story/PortalRippleCanvas.tsx` — on-demand ripple/drop canvas.
- `src/components/water-story/PortalRippleCanvas.test.tsx` — exact-position, boundary, DPR, pause, and cleanup tests.
- `src/components/water-story/WaterSurface.tsx` — waterline, underwater atmosphere, bubbles, rays, and caustics.
- `src/components/water-story/WaterSurface.test.tsx` — decorative structure and accessibility tests.

### Modify

- `src/components/Hero.tsx` — assemble the new water story and preserve semantic copy/CTAs.
- `src/components/Hero.test.tsx` — assert portal-first composition and exact content.
- `src/pages/HomePage.tsx` — remove the separate transition scene.
- `src/App.test.tsx` — assert the hero hands directly into `ChallengeSection`.
- `src/components/interactive-sections.css` — replace interim hero/scene rules with portal, morph, waterline, responsive, paused, and reduced-motion styles.
- `src/components/Header.tsx` — retain homepage dark compatibility and existing scrolled behavior; change only if integration tests expose a contrast regression.
- `public/images/IMAGE-SOURCES.md` — remove entries for discarded interim artwork.

### Remove

- `src/components/PortalTransitionScene.tsx`
- `src/components/PortalTransitionScene.test.tsx`
- `src/components/ui/HeroInteractions.tsx`
- `src/components/ui/HeroInteractions.test.tsx`
- `public/images/living-water-next-scene.webp`
- `public/images/living-water-portal-hero.webp`
- `public/images/living-water-scene-frame-1.webp`
- `public/images/living-water-scene-frame-2.webp`

`HeroWaterEffect.tsx` remains until Task 5 proves its behavior has been replaced; then remove it only if no import remains.

---

### Task 1: Pure Water-Story Interpolation

**Files:**
- Create: `src/components/water-story/waterStoryMath.ts`
- Create: `src/components/water-story/waterStoryMath.test.ts`

**Interfaces:**
- Consumes: none.
- Produces:
  - `type WaterStoryValues = { progress: number; portalProgress: number; portalScale: number; copyOpacity: number; immersionProgress: number; exitProgress: number; waterlinePercent: number; imageScale: number }`
  - `deriveWaterStoryValues(progress: number): WaterStoryValues`
  - `interpolatePortalPath(progress: number): string`
  - `clamp01(value: number): number`

- [ ] **Step 1: Write failing interpolation tests**

Add tests named:

- `clamps story progress to zero and one`;
- `keeps the initial portal stable through the opening beat`;
- `reaches the specified expansion and immersion values at stage boundaries`;
- `moves the waterline from 60 to 23 percent during exit`;
- `returns the initial organic path, a wide midpoint, and a full-frame final path`.

Assert `portalScale` at representative progress points maps to `1`, `1.04`, `1.09`, `1.15`, and `1.22` within a tolerance of `0.01`; `copyOpacity` is `1` at `0`, nearly `0` by `.60`; `imageScale` never exceeds `1.06`; and final `waterlinePercent` is `23`.

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- --run src/components/water-story/waterStoryMath.test.ts`

Expected: FAIL because `waterStoryMath.ts` does not exist.

- [ ] **Step 3: Implement the pure helpers**

Use clamped piecewise-linear interpolation. Define three same-command SVG path coordinate arrays for organic, wide, and full-frame shapes and serialize their interpolated points without DOM access.

- [ ] **Step 4: Run the test and verify GREEN**

Run: `npm test -- --run src/components/water-story/waterStoryMath.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/water-story/waterStoryMath.ts src/components/water-story/waterStoryMath.test.ts
git commit -m "feat: define water story interpolation"
```

---

### Task 2: Single Sticky Scroll Controller

**Files:**
- Create: `src/components/water-story/WaterStoryScroll.tsx`
- Create: `src/components/water-story/WaterStoryScroll.test.tsx`

**Interfaces:**
- Consumes: `deriveWaterStoryValues(progress)` and `interpolatePortalPath(progress)` from Task 1.
- Produces: `WaterStoryScroll({ children }: PropsWithChildren): ReactElement`, rendering `.water-story` and `.water-story__sticky`, then updating the descendant `[data-water-mask]` supplied by `LivingWaterPortal`.

- [ ] **Step 1: Write the failing controller tests**

Test that the component:

- paints non-zero restored-scroll progress on mount;
- writes `--water-progress`, `--portal-scale`, `--copy-opacity`, `--immersion-progress`, `--exit-progress`, `--waterline-percent`, and `--image-scale`;
- updates `[data-water-mask]` with `interpolatePortalPath` after a scheduled scroll frame;
- recalculates after resize and clamps progress;
- sets progress to the static reduced-motion value without installing scroll-driven motion;
- works without observer APIs;
- cancels a pending frame and removes every listener/observer on unmount.

Mock geometry with `offsetTop`, `offsetHeight`, and `innerHeight`; assert behavior, not implementation call counts except for cleanup.

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- --run src/components/water-story/WaterStoryScroll.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement `WaterStoryScroll`**

Use refs and direct style writes. Schedule only one frame at a time. Add passive `scroll` and `resize` listeners, document visibility handling, an optional `IntersectionObserver`, modern and legacy motion-query listeners, and complete cleanup.

- [ ] **Step 4: Run the test and verify GREEN**

Run: `npm test -- --run src/components/water-story/WaterStoryScroll.test.tsx src/components/water-story/waterStoryMath.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/water-story/WaterStoryScroll.tsx src/components/water-story/WaterStoryScroll.test.tsx
git commit -m "feat: add water story scroll controller"
```

---

### Task 3: Organic Living Water Portal

**Files:**
- Create: `src/components/water-story/LivingWaterPortal.tsx`
- Create: `src/components/water-story/LivingWaterPortal.test.tsx`

**Interfaces:**
- Consumes: the `[data-water-mask]` contract updated by `WaterStoryScroll`.
- Produces: `LivingWaterPortal(): ReactElement`, including the accessible primary SVG/image, liquid-edge paths, five or fewer decorative droplets, and a mount point for `PortalRippleCanvas`.

- [ ] **Step 1: Write the failing portal tests**

Assert that:

- the portal uses `/images/home-hero-wastewater.webp`;
- the visual exposes the meaningful accessible name “Representative pilot wastewater treatment system integrated with vegetation”;
- exactly one image is exposed to assistive technology;
- the clip path contains `[data-water-mask]`;
- outer water, inner highlight, and refraction layers exist;
- no rectangular card, particle field, or extra factual text is introduced.

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- --run src/components/water-story/LivingWaterPortal.test.tsx`

Expected: FAIL because the portal component does not exist.

- [ ] **Step 3: Implement `LivingWaterPortal`**

Render a responsive SVG with `preserveAspectRatio="xMidYMid slice"`, one accessible `<svg role="img">`, a clipped `<image>`, duplicate edge-only refraction content hidden from assistive technology, and localized water-edge gradients/filters. Do not add continuous JavaScript animation.

- [ ] **Step 4: Run the test and verify GREEN**

Run: `npm test -- --run src/components/water-story/LivingWaterPortal.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/water-story/LivingWaterPortal.tsx src/components/water-story/LivingWaterPortal.test.tsx
git commit -m "feat: build organic living water portal"
```

---

### Task 4: Portal Ripple and Droplet Canvas

**Files:**
- Create: `src/components/water-story/PortalRippleCanvas.tsx`
- Create: `src/components/water-story/PortalRippleCanvas.test.tsx`
- Modify: `src/components/water-story/LivingWaterPortal.tsx`
- Modify: `src/components/water-story/LivingWaterPortal.test.tsx`

**Interfaces:**
- Consumes: a portal container identified by `.living-water-portal__interaction` and story `data-active` state.
- Produces: `PortalRippleCanvas(): ReactElement`; two or three elliptical rings per valid click/tap; at most one ambient falling droplet at a time; DPR capped at `2`.

- [ ] **Step 1: Write failing interaction tests**

Test exact portal-local coordinates, rejection of points outside the organic portal bounds, three drawn ellipse rings, maximum ripple count, DPR cap, reduced-motion suppression, hidden-document pause, off-screen pause, legacy media-query support, and cleanup of frame/timer/listener/observer resources.

- [ ] **Step 2: Run the tests and verify RED**

Run: `npm test -- --run src/components/water-story/PortalRippleCanvas.test.tsx`

Expected: FAIL because the canvas component does not exist.

- [ ] **Step 3: Implement `PortalRippleCanvas` and mount it in the portal**

Refactor the proven ellipse/droplet drawing behavior from `HeroWaterEffect`; do not import or mount `HeroWaterEffect`. Run frames only while ripple/drop arrays are non-empty and the story is active.

- [ ] **Step 4: Run the tests and verify GREEN**

Run: `npm test -- --run src/components/water-story/PortalRippleCanvas.test.tsx src/components/water-story/LivingWaterPortal.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/water-story/PortalRippleCanvas.tsx src/components/water-story/PortalRippleCanvas.test.tsx src/components/water-story/LivingWaterPortal.tsx src/components/water-story/LivingWaterPortal.test.tsx
git commit -m "feat: add portal water interactions"
```

---

### Task 5: Waterline and Underwater Atmosphere

**Files:**
- Create: `src/components/water-story/WaterSurface.tsx`
- Create: `src/components/water-story/WaterSurface.test.tsx`

**Interfaces:**
- Consumes: CSS variables `--immersion-progress`, `--exit-progress`, and `--waterline-percent`, plus ancestor `data-active`.
- Produces: `WaterSurface(): ReactElement`, two SVG wave paths, `.water-surface__underwater`, `.water-surface__caustics`, `.water-surface__rays`, and 10 decorative bubbles on desktop.

- [ ] **Step 1: Write failing structure and accessibility tests**

Assert two distinct irregular wave paths, one underwater depth layer, caustics and rays layers, exactly 10 decorative bubbles, `aria-hidden="true"` on the complete decorative surface, and no additional accessible image or text.

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- --run src/components/water-story/WaterSurface.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement `WaterSurface`**

Use SVG paths for a 6–14px irregular waterline. Use CSS gradient layers for depth, localized refraction, low-opacity caustics, and diagonal light rays. Render fixed bubble markup with deterministic size/position custom properties; CSS handles slow rise and fade.

- [ ] **Step 4: Run the test and verify GREEN**

Run: `npm test -- --run src/components/water-story/WaterSurface.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/water-story/WaterSurface.tsx src/components/water-story/WaterSurface.test.tsx
git commit -m "feat: add cinematic waterline atmosphere"
```

---

### Task 6: Assemble the Continuous Hero Story

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/Hero.test.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/components/interactive-sections.css`
- Remove: `src/components/PortalTransitionScene.tsx`
- Remove: `src/components/PortalTransitionScene.test.tsx`
- Remove: `src/components/ui/HeroInteractions.tsx`
- Remove: `src/components/ui/HeroInteractions.test.tsx`

**Interfaces:**
- Consumes: `WaterStoryScroll`, `LivingWaterPortal`, `WaterSurface`, and existing `ButtonLink`.
- Produces: one `.water-story` homepage hero followed directly by `.challenge`; exact heading, body, and CTA destinations remain unchanged.

- [ ] **Step 1: Update tests to describe the consolidated composition**

Make `Hero.test.tsx` assert:

- one `.water-story` and one `.living-water-portal`;
- one accessible wastewater image;
- one `.water-surface`;
- exact heading and only `Greener Buildings` highlighted;
- research and projects destinations unchanged;
- no `.portal-transition-scene`, `.hero__particles`, `.water-contours`, or circular card.

Make `App.test.tsx` assert `.water-story + .challenge` on Home and unchanged global ripple/navigation components.

- [ ] **Step 2: Run the tests and verify RED**

Run: `npm test -- --run src/components/Hero.test.tsx src/App.test.tsx`

Expected: FAIL because the current hero still uses the interim composition.

- [ ] **Step 3: Assemble the components and remove the duplicate scene**

Keep `Hero.tsx` declarative. Remove `PortalTransitionScene` from `HomePage`. Delete interim components only after imports and tests have been updated.

- [ ] **Step 4: Replace interim hero/scene CSS with the five-stage design**

Implement:

- desktop wrapper `200vh`, one-viewport sticky stage, dark navy base;
- initial 38–43% text and 57–62% portal composition;
- progress-driven portal translation/scale and edge opacity;
- full-frame immersion visibility from progress `.60`;
- copy shift and fade by `.60`;
- waterline movement from `60%` to `23%` during exit;
- underwater blue-to-white handoff into `.challenge`;
- `data-active='false'` animation pause rules.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `npm test -- --run src/components/Hero.test.tsx src/App.test.tsx src/components/water-story/*.test.ts src/components/water-story/*.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.tsx src/components/Hero.test.tsx src/pages/HomePage.tsx src/App.test.tsx src/components/interactive-sections.css src/components/water-story
git commit -m "feat: unify homepage living water story"
```

---

### Task 7: Responsive, Reduced-Motion, and Asset Cleanup

**Files:**
- Modify: `src/components/interactive-sections.css`
- Modify: `public/images/IMAGE-SOURCES.md`
- Remove if unused: `src/components/ui/HeroWaterEffect.tsx`
- Remove: `public/images/living-water-next-scene.webp`
- Remove: `public/images/living-water-portal-hero.webp`
- Remove: `public/images/living-water-scene-frame-1.webp`
- Remove: `public/images/living-water-scene-frame-2.webp`

**Interfaces:**
- Consumes: final Task 6 DOM and CSS variable contract.
- Produces: tablet/mobile layouts, static reduced-motion flow, and no unused interim assets.

- [ ] **Step 1: Add failing reduced-motion and mobile assertions**

Extend component tests to assert reduced-motion sets a static story mode and exposes both portal and wide waterline composition without a scroll listener. Keep deterministic bubble markup independent of viewport JavaScript; CSS will hide surplus bubbles on mobile. Add an App assertion that legacy `HeroWaterEffect` and interim scene classes are absent from Home.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test -- --run src/components/Hero.test.tsx src/components/water-story/*.test.ts src/components/water-story/*.test.tsx src/App.test.tsx`

Expected: FAIL on missing static-mode/mobile contracts.

- [ ] **Step 3: Implement responsive and reduced-motion CSS**

At `<=1024px`, reduce portal dimensions. At `<=900px`, stack text above portal. At `<=600px`, use `150vh`, reduced image zoom, 4–6 visible bubbles, no displacement filter, and stable full-width CTAs. Under reduced motion, remove extended wrapper height, sticky positioning, animated water effects, and scroll transforms.

- [ ] **Step 4: Remove unused legacy/interim files and source entries**

Resolve imports with `rg` before each removal. Remove only the explicitly listed files and leave `deploy/` untouched.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `npm test -- --run src/components/Hero.test.tsx src/components/water-story/*.test.ts src/components/water-story/*.test.tsx src/App.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/interactive-sections.css public/images/IMAGE-SOURCES.md
git add -u -- src/components/ui/HeroWaterEffect.tsx public/images
git commit -m "refactor: remove superseded hero effects"
```

---

### Task 8: Full Verification and Visual QA

**Files:**
- Modify only files required to fix verified regressions.

**Interfaces:**
- Consumes: completed water story.
- Produces: a verified production build and responsive visual evidence.

- [ ] **Step 1: Run the complete automated suite**

```bash
npm test -- --run
npm run typecheck
npm run lint
npm run build
```

Expected: all commands exit `0` with no test, type, lint, or build errors.

- [ ] **Step 2: Start the existing Vite development server**

Run the repository's `npm run dev -- --host 127.0.0.1` command on an available local port. Do not change dependencies or Vite configuration.

- [ ] **Step 3: Verify desktop and tablet widths**

Inspect `1920`, `1600`, `1440`, `1366`, `1280`, `1024`, and `768` widths at progress `0`, approximately `.25`, `.50`, `.70`, `.90`, and `1`.

At every width verify:

- scroll remains native;
- portal is not clipped and mask morph is continuous;
- image aspect ratio is preserved;
- text disappears before full immersion;
- waterline sits near `60%` then moves near `23%`;
- no white flash or header contrast failure;
- Challenge section is reachable immediately after story release;
- `document.documentElement.scrollWidth === window.innerWidth`.

- [ ] **Step 4: Verify mobile widths**

Inspect `430`, `390`, `375`, and `360` widths. Verify stacked text/portal, maximum `150vh` story distance, reduced effects, readable CTAs, no image stretching, no layout jump, and no horizontal overflow.

- [ ] **Step 5: Verify interaction, lifecycle, and accessibility**

Check exact-position click and tap ripples, keyboard CTA access, image alternative text, reduced-motion emulation, animation pause outside the story, tab visibility recovery, clean console, and unchanged page-navigation water transition.

- [ ] **Step 6: Re-run verification after any QA fix**

Run all four required commands again. Do not report completion from pre-fix results.

- [ ] **Step 7: Commit final fixes**

```bash
git add <only-files-changed-for-qa>
git commit -m "fix: polish living water story responsiveness"
```

If no QA fixes were required, do not create an empty commit.
