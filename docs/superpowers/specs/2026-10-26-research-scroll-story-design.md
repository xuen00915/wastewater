# Research Scroll Story — Design Specification

## Intent

Turn the Research page into a clear vertical story. Visitors first see all three research programmes together in one row, then continue scrolling into the detailed research. During the detailed section, a sticky title index remains on the left while the full chapter content scrolls on the right. The active programme title becomes large and clear; the other two remain visible in smaller, faded type.

The result should feel like moving from an overview into the research itself, without trapping the user in a horizontal or scripted scroll experience.

## Goals

- Show the relationship among all three research areas before presenting details.
- Let normal vertical scrolling progress through Liquid Treatment, Solid Treatment & Resource Recovery, and Living Walls & Green Infrastructure in that order.
- Keep all three programme titles visible during the detailed story so the visitor always understands their position.
- Give the active chapter a subtle zoom-in and opacity transition as it enters.
- Preserve long-form treatment pathways, research questions, evidence, published foundations, and status notes.
- Use only published sources for technical claims and keep all preliminary OQE results private.

## Non-goals and anti-goals

- No horizontal carousel for switching the detailed content.
- No wheel or touch-scroll hijacking.
- No full-screen lock that prevents normal page progress.
- No hidden chapters or content that requires clicking to discover.
- No hover transformations or one-sided accent borders.
- No claims of certification, achieved biosolids class, or fixed temperature reduction.

## Approaches considered

1. **Overview row plus sticky left index and vertically stacked right chapters — selected.** This preserves normal reading, supports long technical content, and creates the requested active-title hierarchy as the visitor scrolls.
2. **One sticky panel that replaces its right-side content at scroll thresholds.** This is more cinematic, but long chapter content would need internal scrolling or heavy compression.
3. **Horizontal selector with one detail panel.** This is compact but was rejected because the desired experience is a continuous vertical progression.

## Page sequence

1. Existing Research hero.
2. “Three Research Areas. One Circular System.” overview.
3. One visual row containing the three research cards.
4. Scroll transition into “Research Programme in Detail.”
5. Sticky left programme index plus three full chapters stacked on the right.
6. “Monitoring Across the System” rail.
7. Existing “Connecting Water With Living Systems” editorial section.

The generic “Questions That Connect the System” grid remains removed because the chapter content replaces it.

## Overview row

The overview presents all three programmes at the same time:

- Liquid Treatment
- Solid Treatment & Resource Recovery
- Living Walls & Green Infrastructure

On desktop and tablet, the cards form one three-column row. On narrow mobile screens, they remain one unwrapped row inside a native horizontal scroller so they do not collapse into three vertically stacked cards before the detailed story.

Each card includes its number, representative image, title, and short description. It is a normal anchor to the matching detailed chapter. The cards have no hover zoom or lift effect.

## Scroll transition

After the overview row, the first detailed chapter enters with a restrained zoom from approximately `scale(.965)` to `scale(1)` and an opacity increase. This is a reveal of the detailed panel, not a literal shared-element morph from the overview card.

The effect is driven by chapter visibility and never changes the browser’s scrolling behaviour. Under reduced motion, the chapter appears immediately at full scale and opacity.

## Detailed story layout

The detailed story is a two-column layout.

### Left: sticky programme index

The left column remains sticky beneath the site header while the right chapters scroll normally. It contains all three programme titles in document order.

- Active programme: large, high-contrast navy type with its number and icon.
- Inactive programmes: smaller, lower-contrast type, still readable and available as anchor links.
- The change in hierarchy uses type size, weight, opacity, and spacing. It does not use a thick side border.
- Selecting an inactive title scrolls normally to that chapter.

The active item is derived from which right-side chapter occupies the central reading zone. Intersection Observer is the progressive enhancement; the document remains readable if JavaScript is unavailable.

### Right: vertically stacked chapters

All three chapters are present in the DOM and scroll in normal document order. Each chapter contains:

- chapter number, icon, and title
- representative image
- purpose statement
- four-step treatment pathway
- research questions
- evidence being evaluated
- published foundation
- status note that distinguishes research direction from achieved outcome
- descriptive links to published sources

Each chapter has enough separation to make the active change feel deliberate. Entering chapters receive the same subtle scale/opacity reveal. Previous chapters remain in the document above rather than being replaced.

## Chapter content

The detailed copy and sources remain those defined in the approved published-information design:

### 01 — Liquid Treatment

An integrated sequence of biological batch treatment, planted treatment, filtration, disinfection, monitoring, and suitable-reuse evaluation. ISO 30500:2025 may be cited as a relevant safety and performance framework, without implying certification or scope conformity.

### 02 — Solid Treatment & Resource Recovery

Solar-assisted drying and thermal treatment followed by moisture, pathogen-indicator, pollutant, nutrient, and plant-uptake assessment. US EPA Part 503 may explain the multi-part nature of biosolids classification, without claiming a class or approval.

### 03 — Living Walls & Green Infrastructure

Controlled treated-water irrigation, planted modules, configuration comparison, plant-health monitoring, and external/internal environmental observations. Published living-wall studies may explain that outcomes vary by climate, orientation, construction, plants, media, and operation; no universal temperature value is stated.

## Deep links and active state

- `/research/#liquid-treatment`
- `/research/#solid-treatment`
- `/research/#living-walls`

Direct links scroll to the corresponding chapter. As the reader enters another chapter, the URL fragment is replaced without adding a history entry or causing a second scroll. Homepage and footer research links may use the same fragments.

The active left title exposes `aria-current="location"`. The other title links remain normal anchors.

## Responsive behaviour

### Desktop

- Overview: three equal cards in one row.
- Detail: approximately 30% sticky title index and 70% chapter content.
- Left index top is offset below the sticky site header.

### Tablet

- Overview stays one row with tighter card spacing and type.
- Detail uses a narrower sticky left index and wider right content.

### Mobile

- Overview becomes an unwrapped horizontal card row with native swipe and visible continuation.
- The left index becomes a compact sticky horizontal title index above the content because a permanent left column would make the chapter unreadably narrow.
- Chapters remain fully stacked and scroll normally.
- Fixed Live Project and PSI controls must not prevent any source link or final paragraph from being reached.

## Accessibility

- Use semantic navigation for the programme index and semantic articles for chapters.
- Preserve sequential heading levels.
- Every chapter exists in the accessibility tree; no inactive content is hidden.
- Anchor targets use `scroll-margin-top` so the site header and mobile title index do not cover chapter headings.
- Active state is not communicated by opacity alone; it also changes size, weight, and `aria-current`.
- Focus styles are visible on overview cards, index links, and published-source links.
- Reduced-motion preferences remove zoom, opacity transitions, and smooth scrolling.

## Content and provenance guardrails

- Do not host or link the supplied OQE PDF.
- Do not reproduce its slide artwork, NUS marks, personal identifiers, names, preliminary graphs or measurements, or future implementation schedule.
- Do not claim ISO 30500 certification or compliance.
- Do not claim Class A biosolids status.
- Do not claim a fixed living-wall temperature reduction.
- Keep representative-image alt text from implying the image shows the exact experimental apparatus.

## Verification

- Unit-test chapter order, public-source URLs, and copy guardrails.
- Component-test overview anchors, all three rendered articles, active-title updates, `aria-current`, deep-link initialisation, and no hidden inactive content.
- Test Intersection Observer fallback so the first chapter remains active without browser support.
- Verify keyboard anchor navigation and reduced-motion behaviour.
- Run the full unit suite, typecheck, lint, and production build.
- Inspect desktop, tablet, and mobile layouts for sticky behaviour, chapter transitions, active-title hierarchy, page overflow, fixed-control overlap, and all three direct links.

