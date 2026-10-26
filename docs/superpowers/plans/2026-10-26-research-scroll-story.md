# Research Scroll Story Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the horizontal research selector with a three-card overview followed by a vertically scrolling research story with a sticky active-title index on the left and full chapters on the right.

**Architecture:** Keep the existing typed `researchProgramme` content as the single content source. Create a new `ResearchScrollStory` component that renders all three overview cards, all three long-form chapters, and an Intersection Observer-driven active title index without hiding content. Replace the old explorer component and stylesheet only after the new component passes focused tests.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Vitest 5, Testing Library, Intersection Observer, project CSS.

**Spec:** `docs/superpowers/specs/2026-10-26-research-scroll-story-design.md`

## Global Constraints

- Use normal vertical document scrolling; do not intercept wheel, touch, or keyboard page scrolling.
- Desktop/tablet overview cards stay in one three-column row; mobile uses one unwrapped native horizontal row.
- All three detailed chapters remain rendered and readable in document order.
- The left programme index is sticky, shows all three titles, and uses size, weight, opacity, and `aria-current="location"` for active state—never a one-sided accent border.
- Chapter entry may use only subtle scale and opacity; reduced motion removes transforms, transitions, and smooth scrolling.
- Preserve the existing published-only chapter content and technical-source links.
- Do not expose the supplied OQE PDF, private identifiers, preliminary results, future schedule, or unsupported certification/performance claims.
- Support `/`, configured `BASE_URL`, direct chapter fragments, 320 CSS pixels, and the existing fixed utility controls.
- Work locally only; do not deploy.
- Do not create commits because the current worktree contains overlapping user-owned changes.

## Review Focus

- Observer overlap: when two chapters intersect simultaneously, the chapter occupying the central reading zone should become active without rapid oscillation.
- Observer absence: browsers or tests without Intersection Observer must keep Liquid Treatment active while all content remains readable.
- Direct fragments: loading any valid chapter hash must make the matching left title active and land the chapter below sticky UI; unknown hashes must fall back safely.
- Mobile sticky index: it must not cover chapter headings or create page-level horizontal overflow at 320 CSS pixels.
- Fixed utilities: the final source links and monitoring text must remain reachable above the page end even when Live Project and PSI controls are visible.

---

### Task 1: Semantic scroll story and active-chapter behaviour

**Files:**
- Create: `src/components/ResearchScrollStory.tsx`
- Create: `src/components/ResearchScrollStory.test.tsx`
- Reuse: `src/data/researchProgramme.ts`

**Interfaces:**
- Consumes: `researchChapters`, `monitoringAcrossSystem`, `defaultResearchChapterId`, `isResearchChapterId`, and `ResearchChapterId`.
- Produces: `ResearchScrollStory(): JSX.Element`.
- Produces IDs `research-overview`, `research-programme-detail`, and one article per exact `ResearchChapterId`.
- Produces a labelled navigation “Research programme sections”; its active link has `aria-current="location"`.

- [ ] **Step 1: Write failing semantic-rendering tests**

Assert one overview containing three linked cards, one programme navigation containing three anchor links, three chapter articles with exact IDs, all twelve pathway steps, all chapter headings and published-source links in the DOM at the same time, no `tablist`/`tab`/`tabpanel` roles, and no prohibited claims.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- --run src/components/ResearchScrollStory.test.tsx`

Expected: FAIL because `ResearchScrollStory` does not exist.

- [ ] **Step 3: Write failing active-state and deep-link tests**

Provide a controlled Intersection Observer test double that records observed elements and lets the test deliver intersection entries. Assert Liquid Treatment is the no-hash default, a valid `#solid-treatment` hash starts with Solid active, an unknown hash falls back to Liquid, the highest-ratio intersecting chapter receives `aria-current="location"`, its article gains `research-story__chapter--active`, and the URL fragment is replaced without adding a navigation entry.

- [ ] **Step 4: Write the failing observer-fallback test**

Render with `window.IntersectionObserver` unavailable and assert Liquid remains active, all three chapters stay visible to accessibility queries, and no exception is thrown.

- [ ] **Step 5: Implement `ResearchScrollStory()`**

Render the heading and three-card overview first, then the sticky semantic title navigation and three full `article` chapters on the right. Reuse the existing chapter fields for media, purpose, pathways, questions, evidence, foundation, status, and sources. Finish with the existing monitoring rail.

- [ ] **Step 6: Implement active-chapter observation**

Observe the three article elements with a central reading-zone root margin. For each callback, choose the intersecting entry with the greatest `intersectionRatio`; use document order as the stable tie-break. Update active state and replace the fragment only when the ID changes. Initialise from a valid fragment and leave Liquid active if the observer API is absent.

- [ ] **Step 7: Run the focused tests and verify they pass**

Run: `npm test -- --run src/components/ResearchScrollStory.test.tsx src/data/researchProgramme.test.ts`

Expected: PASS.

### Task 2: Overview row, sticky index, chapter hierarchy, and motion

**Files:**
- Create: `src/components/research-scroll-story.css`
- Modify: `src/components/presentationStyles.test.ts`

**Interfaces:**
- Consumes: class names produced by `ResearchScrollStory`.
- Produces: three-column overview, desktop/tablet two-column story, sticky title index, mobile horizontal overview and sticky horizontal title index, active/inactive title hierarchy, and reduced-motion overrides.

- [ ] **Step 1: Write failing style-contract tests**

Import `research-scroll-story.css?raw` and assert: the overview grid has three columns; the story grid has a left/right layout; the index uses `position:sticky`; inactive titles use lower opacity and smaller type; the active title uses larger type and full opacity; chapters use subtle scale/opacity; no selector in the stylesheet uses a one-sided border; mobile overview uses `overflow-x:auto` without wrapping; mobile story is one column; chapter IDs have scroll margin; and reduced motion removes transform, transition, and smooth scrolling.

- [ ] **Step 2: Run the presentation test and verify it fails**

Run: `npm test -- --run src/components/presentationStyles.test.ts`

Expected: FAIL because the new stylesheet does not exist.

- [ ] **Step 3: Implement desktop and tablet styling**

Create a one-row three-card overview with stable cards and no hover effects. Build a two-column detail grid with a sticky left index and vertically separated right chapters. Use typography and opacity for active hierarchy, and constrain the chapter zoom to approximately `.965` → `1`.

- [ ] **Step 4: Implement mobile styling**

At `max-width:760px`, keep the overview as a native horizontal row, collapse the story to one content column, and convert the title index into a compact sticky horizontal navigation beneath the site header. Add bottom space so fixed utilities cannot block the final sources or monitoring rail.

- [ ] **Step 5: Implement focus and reduced-motion styling**

Give overview, title-index, and source links visible `:focus-visible` outlines. Under `prefers-reduced-motion:reduce`, remove smooth scrolling, chapter transforms, opacity fades, and transitions.

- [ ] **Step 6: Run component and style tests**

Run: `npm test -- --run src/components/ResearchScrollStory.test.tsx src/components/presentationStyles.test.ts`

Expected: PASS.

### Task 3: Page integration and removal of the superseded carousel

**Files:**
- Modify: `src/pages/ResearchPage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Delete: `src/components/ResearchExplorer.tsx`
- Delete: `src/components/ResearchExplorer.test.tsx`
- Delete: `src/components/research-explorer.css`

**Interfaces:**
- Consumes: `ResearchScrollStory` from Task 1 and its stylesheet from Task 2.
- Changes: Research page composition becomes hero → scroll story → editorial feature.

- [ ] **Step 1: Write the failing page-composition test**

Update the Research-page test to require the three-card overview before `research-programme-detail`, all three chapter articles before the editorial feature, one programme navigation with one `aria-current` link, and no tab roles or “Questions That Connect the System” section.

- [ ] **Step 2: Run the focused integration tests and verify they fail**

Run: `npm test -- --run src/App.test.tsx src/components/ContentSections.test.tsx`

Expected: FAIL because the Research page still renders the superseded explorer.

- [ ] **Step 3: Integrate `ResearchScrollStory`**

Replace the `ResearchExplorer` import/render in `ResearchPage.tsx`. Replace the stylesheet import in `App.tsx`. Preserve homepage card deep links created by `ResearchPillars`.

- [ ] **Step 4: Remove the old explorer files**

Delete the old component, test, and stylesheet only after the new focused and integration tests are green. Confirm no `ResearchExplorer`, `research-explorer`, or tab-role references remain.

- [ ] **Step 5: Run the focused integration tests**

Run: `npm test -- --run src/App.test.tsx src/components/ContentSections.test.tsx src/components/ResearchScrollStory.test.tsx src/components/presentationStyles.test.ts`

Expected: PASS.

### Task 4: Full verification and local browser review

**Files:**
- Modify only if verification finds an issue: files from Tasks 1–3.

**Interfaces:**
- Consumes: completed Research scroll story.
- Produces: verified local preview; no deployment.

- [ ] **Step 1: Run all automated checks**

Run: `npm test -- --run && npm run typecheck && npm run lint && npm run build`

Expected: every command exits 0.

- [ ] **Step 2: Inspect responsive layouts**

At approximately 1440×900, 768×1024, 390×844, and 320×700, verify the overview row, normal vertical scrolling, sticky index, active/inactive title hierarchy, chapter zoom, focus visibility, no page-level horizontal overflow, and reachable final content above fixed utilities.

- [ ] **Step 3: Verify the full scroll sequence**

Scroll from the overview through all three chapters. Confirm the active title advances Liquid → Solid → Living Walls, the other titles remain visible and faded, and the URL fragment follows without scroll jumps.

- [ ] **Step 4: Verify direct links and base-path output**

Open all three `/research/#…` links directly. Build with the configured non-root base and confirm homepage deep links retain both base path and fragment.

- [ ] **Step 5: Review scope and provenance**

Run `git diff --check` and inspect the scoped working-tree diff. Confirm the OQE PDF was not added, no unpublished measurement or unsupported claim appears, no one-sided accent border or hover transform remains, and unrelated user changes were preserved.

