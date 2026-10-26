# Deep Dive Water Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved Deep Dive tint, light-ray, haze, and scroll-driven bubble treatment to the existing Home water story for local preview only.

**Architecture:** Keep the existing `WaterStoryScroll` owner of scroll progress and render one decorative React overlay inside its sticky viewport. Derive all namespaced visual values from the same clamped progress, write them during the existing animation-frame paint, and leave the hero, challenge overlay, and current scroll variables unchanged.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite

**Spec:** `/Users/dmsyx/Downloads/E_ST_Deep_Dive_Scroll_Effect.md`

## Global Constraints

- Preserve `.water-story`, `.water-story__sticky`, `.hero__cinematic`, `.hero__copy`, `.challenge--overlay`, all copy, and all current React-controlled scroll variables.
- The new layer is decorative, `aria-hidden`, non-focusable, and `pointer-events: none`.
- The effect follows scroll in both directions, does not auto-scroll, and does not alter the story height.
- Hide the enhancement for `prefers-reduced-motion` and existing static-story mode.
- Render seven bubbles or fewer on phones and keep the current mobile touch behavior.
- Make local source changes only; do not deploy or modify the live website.

## Review Focus

- Restored non-zero scroll positions must paint the correct deep-dive state on mount.
- Progress before entry and after exit must leave the decoration visually absent.
- Reduced-motion mode must not expose the enhancement.
- Unmounting or navigating away must remove listeners and the rendered overlay with the Home component.
- The overlay must stay below content and must not intercept header, CTA, live-project, or PSI interactions.

---

### Task 1: Deep-dive progress model

**Files:**
- Create: `src/components/water-story/deepDiveMath.ts`
- Create: `src/components/water-story/deepDiveMath.test.ts`

**Interfaces:**
- Produces: `deriveDeepDiveValues(progress: number): DeepDiveValues` and immutable bubble settings used by rendering.

- [ ] Write failing tests for entry, peak, exit, clamping, and distinct reversible bubble transforms.
- [ ] Run `npm test -- src/components/water-story/deepDiveMath.test.ts` and confirm the missing module/API failure.
- [ ] Implement the exact smooth-step timing and strength values from the approved spec.
- [ ] Rerun the focused tests and confirm they pass.

### Task 2: React overlay and existing scroll-loop integration

**Files:**
- Create: `src/components/water-story/DeepDiveOverlay.tsx`
- Modify: `src/components/water-story/WaterStoryScroll.tsx`
- Modify: `src/components/water-story/WaterStoryScroll.test.tsx`

**Interfaces:**
- Consumes: `deriveDeepDiveValues` and bubble settings from Task 1.
- Produces: one `.east-deep-dive` layer with namespaced CSS variables and 14 decorative bubbles.

- [ ] Write failing component tests for markup, initial/restored scroll paint, orientation repaint, and cleanup.
- [ ] Run the focused component test and confirm failures are caused by the missing overlay behavior.
- [ ] Render the overlay and update it from the component's existing requestAnimationFrame loop.
- [ ] Rerun the focused component test and confirm it passes.

### Task 3: Responsive visual treatment and local QA

**Files:**
- Modify: `src/components/interactive-sections.css`

**Interfaces:**
- Consumes: the `.east-deep-dive*` markup and variables from Task 2.
- Produces: desktop, tablet, phone, and reduced-motion presentation.

- [ ] Add the scoped tint, haze, ray, bubble, mobile-density, and reduced-motion rules from the approved spec.
- [ ] Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`.
- [ ] Start the local Vite server and inspect the Home story at 320, 768, 1024, and 1440 px, including mid-scroll, reverse scroll, console health, and CTA/widget interaction.
- [ ] Stop the local server and report the local preview URL and any remaining visual deviations without deploying.
