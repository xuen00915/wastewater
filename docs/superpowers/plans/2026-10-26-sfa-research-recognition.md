# SFA Research Recognition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an accessible SFA research-recognition feature and unchanged source PDF to the Projects page.

**Architecture:** A focused `ResearchRecognition` component will own the verified copy and PDF action. `ProjectsPage` will compose it between the existing hero and ongoing-project panel; the existing page-section stylesheet will provide a responsive editorial split layout.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, CSS

**Spec:** `docs/superpowers/specs/2026-10-26-sfa-research-recognition-design.md`

## Global Constraints

- Preserve the supplied PDF byte-for-byte at `public/documents/sfa-sustainable-aquaculture-media-release-2021.pdf`.
- Use exact source/date wording: `Singapore Food Agency` and `26 April 2021`.
- State that NUS and E and ST Environmental Pte Ltd were listed as the project team.
- Do not say E&ST received S$23 million or imply SFA endorsement.
- Add no dependencies and do not commit within the user's existing dirty worktree.

## Review Focus

- The PDF link must resolve under both `/` and `/staging/` base paths; test the generated `href` with a stubbed base URL pattern already used in the repo.
- The link must open in a new tab with `rel="noopener noreferrer"` and an explicit accessible name.
- The source copy must distinguish the named project from the grant call covering 12 projects.
- The four-page PDF must be copied without modification; verify its SHA-256 hash against the supplied source.
- The editorial split must stack cleanly at 390px without horizontal overflow or interference from floating controls.

---

### Task 1: Research recognition component and source document

**Files:**
- Create: `src/components/ResearchRecognition.tsx`
- Create: `src/components/ResearchRecognition.test.tsx`
- Create: `public/documents/sfa-sustainable-aquaculture-media-release-2021.pdf`

**Interfaces:**
- Consumes: `import.meta.env.BASE_URL`, `Reveal`, and `ButtonLink`.
- Produces: `ResearchRecognition(): JSX.Element` with section label, verified summary, source metadata, and PDF action.

- [ ] **Step 1: Write the failing component test**

Assert that `ResearchRecognition` renders the section heading, project title, NUS and E and ST Environmental Pte Ltd attribution, 12-project context, source/date, and a PDF link that opens in a new tab with safe `rel` attributes.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- --run src/components/ResearchRecognition.test.tsx`

Expected: FAIL because `ResearchRecognition` does not exist.

- [ ] **Step 3: Implement the component**

Create the component with exact factual copy from the approved spec, using semantic `section`, `h2`, `p`, and link markup. Build the PDF URL from `import.meta.env.BASE_URL` and `documents/sfa-sustainable-aquaculture-media-release-2021.pdf`.

- [ ] **Step 4: Copy and hash-check the PDF**

Copy `/Users/dmsyx/Downloads/SFA NUS-E&ST Press release.pdf` unchanged to the public documents path, then compare `shasum -a 256` output for both files.

- [ ] **Step 5: Run the component test to verify it passes**

Run: `npm test -- --run src/components/ResearchRecognition.test.tsx`

Expected: PASS.

### Task 2: Projects-page integration and responsive styling

**Files:**
- Modify: `src/pages/ProjectsPage.tsx`
- Modify: `src/components/page-sections.css`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes: `ResearchRecognition` from Task 1.
- Produces: Projects-page order `InternalPageHero` → `ResearchRecognition` → `OngoingProjectPanel` → `ProjectsSection`.

- [ ] **Step 1: Write the failing page-composition test**

Render `/projects/` and assert the recognition heading is present exactly once, the source/date is visible, and the recognition section precedes the ongoing project panel in document order.

- [ ] **Step 2: Run the page test to verify it fails**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL because the recognition section is not composed on the page.

- [ ] **Step 3: Integrate the component**

Import and place `ResearchRecognition` immediately after `InternalPageHero` in `ProjectsPage`.

- [ ] **Step 4: Add responsive styles**

Add `.research-recognition` styles to `page-sections.css`: restrained tinted section, two-column editorial layout on desktop, compact metadata treatment, and a single-column stack below 768px. Reuse existing CSS variables and button styles.

- [ ] **Step 5: Run focused tests**

Run: `npm test -- --run src/components/ResearchRecognition.test.tsx src/App.test.tsx`

Expected: PASS.

### Task 3: Release and visual verification

**Files:**
- Verify only; do not add QA artifacts to the repository.

**Interfaces:**
- Consumes: local `/projects/` page and public PDF route.
- Produces: verified desktop/mobile screenshots outside the repo and release-gate results.

- [ ] **Step 1: Verify the PDF and site build**

Run the source/public SHA-256 comparison, `npm test -- --run`, `npm run typecheck`, `npm run lint`, `npm run build`, and `git diff --check`.

Expected: hashes match; 0 test, type, lint, build, or whitespace failures.

- [ ] **Step 2: Verify rendered desktop and mobile layouts**

Use the available browser path at 1814×1060 and 390×844. Confirm page identity, meaningful content, no framework overlay, no relevant console errors, no clipping/overflow, and a clear visual hierarchy.

- [ ] **Step 3: Verify the target interaction**

Activate the “Read the SFA media release” link and confirm it resolves to the local PDF route in a separate tab.

- [ ] **Step 4: Keep the result local**

Report the preview and checks without deploying. Wait for an explicit `deploy` request before changing staging or production.

