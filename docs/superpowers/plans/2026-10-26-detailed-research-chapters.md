# Horizontal Research Explorer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a horizontally scrollable three-area Research selector with one source-grounded detail panel beneath it, while preserving deep links from the homepage.

**Architecture:** Store detailed programme content in a typed data module. Render it through a stateful `ResearchExplorer` that combines a native scroll-snap tab list with one accessible detail panel. Keep the homepage’s existing `ResearchPillars` cards, but give each card a BASE_URL-aware deep link into the matching explorer selection.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Vitest 5, Testing Library, project CSS.

**Spec:** `docs/superpowers/specs/2026-10-26-detailed-research-chapters-design.md`

## Global Constraints

- Use only public standards and published research for technical claims.
- Do not host or link the supplied OQE PDF or reproduce its slide artwork or NUS marks.
- Do not publish personal identifiers, supervisor names, preliminary charts or measurements, or the future implementation schedule.
- Do not claim ISO 30500 certification or compliance, Class A biosolids status, or a fixed living-wall temperature reduction.
- Keep project research questions visually and semantically distinct from published findings.
- Reuse the three existing representative research images and keep their alt text non-evidentiary.
- Use native horizontal scrolling and scroll snapping; do not hijack vertical page scrolling.
- Horizontal scrolling alone must not change selection; click/tap or keyboard selection updates the detail panel.
- Support BASE_URL-aware deep links, 320 CSS pixels, keyboard navigation, and reduced motion.
- Work locally only; do not deploy.
- Do not create commits during execution because the current worktree contains overlapping user-owned changes.

## Review Focus

- Deep linking: valid fragments choose the matching tab; missing or unknown fragments choose Liquid Treatment without breaking rendering.
- Keyboard behaviour: ArrowLeft/ArrowRight/Home/End move both focus and selection while keeping the active card visible.
- Scroll containment: horizontal card browsing must not produce page-level horizontal overflow or interfere with vertical scrolling.
- Floating utilities: fixed Live Project and PSI controls must not obscure detail content or source links.
- Claim integrity and source safety: prohibited performance claims remain absent and external links are descriptive, absolute HTTPS, and safe new tabs.

---

### Task 1: Typed research-programme content

**Files:**
- Create: `src/data/researchProgramme.ts`
- Create: `src/data/researchProgramme.test.ts`

**Interfaces:**
- Produces: `ResearchChapterId = 'liquid-treatment' | 'solid-treatment' | 'living-walls'`.
- Produces: `ResearchChapter`, `ResearchPathwayStep`, and `PublishedSource` types.
- Produces: `researchChapters: readonly ResearchChapter[]`, `defaultResearchChapterId: ResearchChapterId`, `isResearchChapterId(value: string): value is ResearchChapterId`, and `monitoringAcrossSystem: string`.
- Each chapter contains `id`, `number`, `title`, `shortDescription`, `purpose`, `image`, `alt`, `icon`, `pathway`, `questions`, `evidence`, `foundation`, `statusNote`, and `sources`.

- [ ] **Step 1: Write the failing content-integrity tests**

Assert the exact three IDs and titles, `defaultResearchChapterId === 'liquid-treatment'`, the type guard accepts only the three IDs, every chapter has four pathway steps and non-empty question/evidence/source lists, every source URL uses HTTPS, every image uses `import.meta.env.BASE_URL`, and serialised public copy excludes `ISO certified`, `Class A achieved`, `>10`, the supplied PDF filename, and student/supervisor identifiers.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- --run src/data/researchProgramme.test.ts`

Expected: FAIL because `src/data/researchProgramme.ts` does not exist.

- [ ] **Step 3: Implement the typed content module**

Create the approved chapter content and use the existing `research-liquid-treatment.webp`, `research-solid-treatment.webp`, and `research-green-wall.webp` assets. Include only the approved public foundations: ISO 30500:2025, US EPA Part 503 and land-application guidance, Mathioudakis et al. (2009), Prodanovic et al. (2018 and 2020), and the 2023 subtropical living-wall thermal study.

- [ ] **Step 4: Run the focused test and verify it passes**

Run: `npm test -- --run src/data/researchProgramme.test.ts`

Expected: PASS.

### Task 2: Horizontal selector and active detail panel

**Files:**
- Create: `src/components/ResearchExplorer.tsx`
- Create: `src/components/ResearchExplorer.test.tsx`
- Create: `src/components/research-explorer.css`
- Modify: `src/App.tsx`
- Modify: `src/components/presentationStyles.test.ts`

**Interfaces:**
- Consumes: all exports from Task 1.
- Produces: `ResearchExplorer(): JSX.Element`.
- Produces: labelled `tablist` “Research areas”, tabs with IDs `research-tab-${chapter.id}`, one panel with ID `research-detail-panel`, and section heading “Three Research Areas. One Circular System.”

- [ ] **Step 1: Write the failing interaction tests**

Test the Liquid Treatment default; three tabs with exact selected states; one visible detail panel; click selection; ArrowLeft/ArrowRight wrap; Home/End selection; focus movement; four pathway steps for the active chapter; published links with `target="_blank"` and `rel="noreferrer"`; valid initial `#solid-treatment` selection; unknown-fragment fallback; and prohibited-claim absence.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- --run src/components/ResearchExplorer.test.tsx`

Expected: FAIL because `ResearchExplorer` does not exist.

- [ ] **Step 3: Implement `ResearchExplorer()` state and semantics**

Initialise selection from `window.location.hash`, guarded by `isResearchChapterId`, with Liquid Treatment as fallback. Render three full-card tab buttons in a horizontal scroller and exactly one tab panel beneath. On pointer or keyboard selection, update state, replace the URL fragment without a vertical jump, focus the selected tab when keyboard-driven, and call `scrollIntoView({ inline: 'nearest', block: 'nearest' })` for the tab.

- [ ] **Step 4: Implement the active detail content**

Render the selected chapter’s representative image, purpose, ordered treatment pathway, research questions, evidence being evaluated, published foundation, status note, and source links. Follow with the persistent “Monitoring Across the System” rail. Use `MediaPlaceholder`, `Icon`, and existing typography primitives where they preserve the specified semantics.

- [ ] **Step 5: Add scoped responsive styling and import it**

Create `research-explorer.css`. Give the selector `overflow-x:auto`, `scroll-snap-type:x mandatory`, overscroll containment, keyboard focus visibility, and card bases that leave the next card discoverable at desktop and mobile widths. Style the active card without hover transforms. Use a two-column media/content detail layout on wide screens and one column on mobile. Disable smooth scrolling and opacity transitions under reduced motion. Import the CSS once from `src/App.tsx`.

- [ ] **Step 6: Pin high-risk CSS rules**

Extend `presentationStyles.test.ts` to import the new stylesheet as raw text and assert horizontal overflow, mandatory snap, mobile single-column detail layout, visible focus styling, floating-control clearance, and reduced-motion overrides.

- [ ] **Step 7: Run the component and presentation tests**

Run: `npm test -- --run src/components/ResearchExplorer.test.tsx src/components/presentationStyles.test.ts`

Expected: PASS.

### Task 3: Homepage deep links and Research-page composition

**Files:**
- Modify: `src/data/content.ts`
- Modify: `src/components/ResearchPillars.tsx`
- Modify: `src/components/ContentSections.test.tsx`
- Modify: `src/pages/ResearchPage.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes: `ResearchChapterId` from Task 1 and `ResearchExplorer` from Task 2.
- Changes: `ResearchArea` gains `id: ResearchChapterId`.
- Changes: each `ResearchPillars` card link resolves to `${pageHref('research')}#${area.id}`.

- [ ] **Step 1: Write failing homepage-link tests**

In `ContentSections.test.tsx`, assert the three card links are `/research/#liquid-treatment`, `/research/#solid-treatment`, and `/research/#living-walls`, while preserving the existing intentional two-line heading test.

- [ ] **Step 2: Write the failing Research-page composition test**

In `App.test.tsx`, render `/research/` and assert one “Research areas” tab list, three tabs, one tab panel, the explorer before the closing editorial feature, and the absence of “Questions That Connect the System”. Add a page-level guard against prohibited claims.

- [ ] **Step 3: Run the focused tests and verify they fail**

Run: `npm test -- --run src/components/ContentSections.test.tsx src/App.test.tsx`

Expected: FAIL because distinct homepage fragments and the explorer are not implemented.

- [ ] **Step 4: Add chapter IDs and homepage deep links**

Update `ResearchArea`, the three `researchAreas` objects, and each card href in `ResearchPillars`. Preserve routing through `pageHref('research')`; do not hard-code a deployment prefix.

- [ ] **Step 5: Replace the Research-page overview and generic grid**

Remove `ResearchPillars`, `researchThemes`, `Icon`, `Reveal`, and `SectionHeading` from `ResearchPage.tsx`. Render `<ResearchExplorer />` between the existing hero and `<EditorialFeature />`.

- [ ] **Step 6: Run the focused tests and verify they pass**

Run: `npm test -- --run src/components/ContentSections.test.tsx src/App.test.tsx`

Expected: PASS.

### Task 4: Full verification and local visual review

**Files:**
- Modify only if verification reveals an issue: files from Tasks 1–3.

**Interfaces:**
- Consumes: completed Research explorer.
- Produces: a verified local preview; no deployment.

- [ ] **Step 1: Run the full automated verification suite**

Run: `npm test -- --run && npm run typecheck && npm run lint && npm run build`

Expected: every command exits 0.

- [ ] **Step 2: Start or reuse the local Vite server**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Vite reports a local URL; use the assigned port.

- [ ] **Step 3: Inspect desktop, tablet, and mobile layouts**

At approximately 1440×900, 768×1024, and 390×844, verify horizontal wheel/trackpad and touch-style scrolling, snap positions, next-card discoverability, tap/click and keyboard selection, active-card visibility, detail replacement, focus rings, image crops, no page-level horizontal overflow, and no floating-control overlap.

- [ ] **Step 4: Verify deep links and base-path output**

Open each `/research/#…` fragment directly and confirm the correct tab/panel. Inspect the production build with the configured base and confirm homepage links retain both the base path and fragment.

- [ ] **Step 5: Review scope and provenance**

Run `git diff --check` and inspect the scoped diff. Confirm the OQE PDF was not copied into `public/`, no unpublished numeric result was added, no hover transform was introduced, and no unrelated user change was reverted.

