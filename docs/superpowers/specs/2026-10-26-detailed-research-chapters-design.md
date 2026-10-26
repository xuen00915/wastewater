# Detailed Research Chapters — Design Specification

## Objective

Expand the Research page from a high-level overview into a clear, public-facing explanation of the three connected research programmes:

1. Liquid Treatment
2. Solid Treatment & Resource Recovery
3. Living Walls & Green Infrastructure

The page must use only public standards and published research for technical claims. The supplied OQE document may guide the organisation and research questions, but its unpublished preliminary graphs, numerical results, personal identifiers, future implementation schedule, and branded slide artwork must not appear on the website.

## Editorial position

The copy describes research scope, treatment logic, variables being evaluated, and the published evidence that informs the work. It does not claim that E&ST has already achieved a performance result, obtained a certification, met Class A biosolids requirements, or delivered a fixed temperature reduction.

Use language such as “investigates,” “evaluates,” “examines,” and “is informed by.” Avoid “achieves,” “proves,” “certified,” and unqualified performance numbers.

## Interaction approaches considered

1. **Horizontally scrollable selector with one detail panel — selected.** The three research cards form a swipeable, scroll-snap selector. Selecting a card replaces the detailed content directly underneath. This keeps the page focused while still giving every programme substantial detail.
2. **Horizontal selector with all details stacked below.** This offers easier comparison but creates a long page and weakens the relationship between the selected card and its detail.
3. **Full horizontal scroll story.** This creates a more cinematic sequence but makes long technical content harder to read and is less predictable for keyboard and mobile users.

The selected approach uses familiar tab behaviour inside a native horizontal scroller. It does not hijack normal vertical page scrolling.

## Page architecture

Keep the existing Research hero. Replace the static Research-page overview grid with a focused research explorer headed “Three Research Areas. One Circular System.” The explorer contains a horizontal selector for:

- Liquid Treatment → `#liquid-treatment`
- Solid Treatment & Resource Recovery → `#solid-treatment`
- Living Walls & Green Infrastructure → `#living-walls`

The homepage keeps its existing three-card overview. Each homepage card links to the Research page with the corresponding anchor appended, opening the correct selection.

Directly under the selector, show one detail panel for the active research area. The active card and panel are linked through accessible tab semantics. Selecting another card updates the panel without moving the user away from the section. A valid URL fragment selects the matching programme on page load; an unknown or missing fragment defaults to Liquid Treatment.

The current generic “Questions That Connect the System” card grid is removed from the Research page because the new detail panel makes it redundant. The cross-cutting monitoring rail follows the active detail panel, and the existing closing editorial feature remains last.

## Visual structure

The selector is a native horizontal scroller at every viewport size. Each research card has a substantial fixed basis so the row visibly continues beyond the viewport, uses `scroll-snap-type: x mandatory`, and exposes its scrollbar or another clear positional cue rather than hiding discoverability. The active card is indicated through a persistent border, number, and text treatment—not a hover animation.

The detail panel is a full-width editorial block rather than another grid of small cards. Its reading order is consistent across viewports:

- chapter label and title
- concise purpose statement
- representative image already available in the project
- treatment pathway
- research questions
- evidence being evaluated
- published foundation and status note

The detail transition is a subtle opacity change only when motion is allowed. The panel itself does not slide horizontally. The layout uses generous white space, quiet borders, navy typography, pale blue/green surfaces, and the existing site imagery. It must not resemble or reproduce the supplied slide deck. No information depends on hover.

On touch devices, users swipe the selector and tap the desired card. Horizontal scrolling alone does not silently change the active programme; this prevents accidental content replacement while the user is browsing the cards.

The existing floating Live Project and PSI controls remain available but must not cover chapter content at common desktop and mobile widths.

## Chapter 01 — Liquid Treatment

### Purpose

Explain the investigation of an integrated liquid-treatment train that combines biological batch treatment, a planted or floating treatment stage, filtration, and disinfection to prepare treated water for suitable reuse applications.

### Treatment pathway

1. Biological treatment — sequencing and aeration support controlled treatment of wastewater.
2. Planted treatment — roots and associated biofilms create additional treatment surfaces and nutrient-removal pathways.
3. Filtration — a vegetated slow-sand stage targets remaining suspended matter and supports polishing.
4. Disinfection and reuse evaluation — ultraviolet treatment and water-quality monitoring inform whether the water is suitable for an intended reuse.

### Research questions

- How do airflow, cycle time, and solids-retention time affect treatment stability?
- How do planted treatment stages affect nutrient and suspended-solids removal?
- How do filtration and UV change turbidity and microbiological water quality?
- Which monitored parameters are needed to assess safe, suitable reuse?

### Evidence being evaluated

- water-quality change across each treatment stage
- operational stability under different settings
- turbidity and microbiological indicators before and after polishing/disinfection
- sensor data that can support repeatable operation and future control

### Standards note

ISO 30500:2025 defines safety and performance requirements for prefabricated integrated non-sewered sanitation systems and includes output quality and selected sustainability considerations. The research may evaluate relevant principles, but the site must not imply that the experimental treatment train is ISO-certified or within the standard’s scope without formal verification.

## Chapter 02 — Solid Treatment & Resource Recovery

### Purpose

Explain the investigation of solar-assisted drying and thermal treatment of wastewater solids, followed by chemical, microbiological, and plant-uptake assessment before any potential non-food greenery application is considered.

### Treatment pathway

1. Characterise — establish the moisture, nutrient, pollutant, and microbiological profile of the wet material.
2. Dry and heat — evaluate solar-assisted moisture reduction and controlled thermal exposure.
3. Verify — test the treated material for pathogen indicators, pollutants, and other relevant quality criteria.
4. Assess potential use — examine whether suitably treated material could support non-food plants, including trials that monitor plant uptake where relevant.

### Research questions

- How do solar exposure, temperature, ventilation, and drying time affect moisture reduction?
- What treatment conditions are needed to achieve measurable pathogen reduction?
- How do nutrient and pollutant concentrations change as the material dries?
- What evidence is needed before a recovered material can be considered for a specific use?

### Evidence being evaluated

- moisture content and drying rate
- time–temperature history
- microbiological indicators before and after treatment
- nutrients, heavy metals, and other relevant pollutants
- plant response and uptake in controlled trials

### Standards note

Public biosolids frameworks such as US EPA 40 CFR Part 503 combine pollutant limits, pathogen-reduction requirements, vector-attraction reduction, management practices, monitoring, and recordkeeping. Drying or reaching one temperature alone does not establish “Class A” status. The website therefore describes evaluation criteria rather than claiming a class or reuse approval.

Published research shows that solar drying can reduce sludge moisture and volume, while pathogen outcomes depend on the treatment configuration and environmental conditions. The copy should present this as the scientific basis for testing rather than as a result achieved by the project.

## Chapter 03 — Living Walls & Green Infrastructure

### Purpose

Explain how living walls can serve as the receiving green infrastructure for suitably treated water while also enabling research into plant health, irrigation demand, façade conditions, and environmental monitoring.

### Treatment pathway

1. Supply — deliver suitably treated water through a controlled irrigation system.
2. Grow — use planted modules and engineered media as the living-wall environment.
3. Compare — evaluate wall configurations, irrigation strategies, and reference surfaces.
4. Monitor — log water use, plant condition, and external/internal surface or air temperatures over time.

### Research questions

- How do wall configuration, plant choice, media, and irrigation affect system behaviour?
- How does treated-water irrigation influence plant health and water demand?
- How do planted and reference surfaces differ under comparable weather conditions?
- Which sensors and sampling intervals provide useful long-term evidence?

### Evidence being evaluated

- plant health and vitality
- irrigation volume and water-quality observations
- external and internal surface or air temperature
- weather, shading, and evapotranspiration context
- repeatability across configurations and seasons

### Published-evidence note

Published studies report that living walls can influence façade and surface temperatures, while the scale of the effect varies with climate, orientation, construction, vegetation, and operating conditions. Published greywater-living-wall studies likewise show that plant species, media, design, and hydraulic operation affect treatment performance. The site must not present a universal temperature reduction or claim that the project has achieved one.

## Cross-cutting monitoring rail

Close the three chapters with a slim “Monitoring Across the System” rail. It explains that water-quality, treatment, environmental, and plant data connect the three programmes. This is supporting context, not a fourth research programme.

Suggested copy:

> Monitoring links the treatment train. Water-quality observations, operating conditions, plant response and environmental data help the team compare stages, identify change and refine future tests.

## Sources to cite on the page

The website will use a compact “Published foundation” list at the end of each relevant chapter. Links open in a new tab and use descriptive titles rather than raw URLs.

- ISO, ISO 30500:2025 — Non-sewered sanitation systems: https://www.iso.org/standard/87343.html
- US EPA, Sewage Sludge Laws and Regulations: https://www.epa.gov/biosolids/sewage-sludge-laws-and-regulations
- US EPA, Land Application of Biosolids: https://www.epa.gov/biosolids/land-application-biosolids
- Mathioudakis et al. (2009), Extended Dewatering of Sewage Sludge in Solar Drying Plants, DOI 10.1016/j.desal.2009.01.011: https://doi.org/10.1016/j.desal.2009.01.011
- Prodanovic et al. (2020), Green Wall Height and Design Optimisation for Effective Greywater Pollution Treatment, DOI 10.1016/j.jenvman.2020.110173: https://doi.org/10.1016/j.jenvman.2020.110173
- Prodanovic et al. (2018), Nitrogen Removal in Greywater Living Wall Systems, DOI 10.3390/w10040527: https://doi.org/10.3390/w10040527
- Experimental Assessment of the Thermal Influence of a Continuous Living Wall in a Subtropical Climate (2023), DOI 10.3390/su15042985: https://doi.org/10.3390/su15042985

## Content and provenance guardrails

- Do not host or link the supplied OQE PDF.
- Do not reproduce the OQE slide screenshot or its NUS marks.
- Do not publish the student number, supervisor names, preliminary charts, unpublished measurements, or implementation schedule.
- Do not claim ISO 30500 certification or compliance.
- Do not claim Class A biosolids status.
- Do not claim a fixed living-wall temperature reduction.
- Clearly distinguish project research questions from published findings.
- Keep image alt text representative rather than implying that stock/illustrative images show the exact apparatus.

## Responsive and accessibility requirements

- Use semantic sections with unique heading IDs and sequential heading levels.
- Implement the selector as a labelled tab list with three tab buttons and one tab panel.
- The active tab exposes `aria-selected="true"`; inactive tabs expose `aria-selected="false"` and all tabs reference the shared panel with `aria-controls`.
- Left and right arrow keys move selection and focus; Home and End select the first and last research areas.
- The active tab is automatically scrolled into view with native smooth scrolling, disabled under reduced motion.
- Direct anchor targets include scroll margin so the sticky header does not obscure the explorer heading.
- Homepage research links have meaningful accessible names and open the matching active tab.
- Published-source links identify external destinations and use safe new-tab attributes.
- Content remains usable at 320 CSS pixels with no horizontal overflow.
- Images preserve meaningful crops and avoid text baked into graphics.
- Research details do not depend on animation or hover states.
- Reduced-motion preferences remain respected by the existing reveal system.

## Verification

- Component tests confirm tab semantics, pointer selection, arrow/Home/End keyboard selection, the single active detail panel, pathway steps, source links, default selection, valid deep-link selection, and unknown-fragment fallback.
- Page tests confirm that homepage cards target the correct Research-page fragments and the old generic question grid is absent from the Research page.
- Copy guard tests reject “ISO certified,” “Class A achieved,” and unqualified “>10°C” claims.
- Run the full unit test suite, typecheck, lint, and production build.
- Inspect the local Research page at desktop, tablet, and mobile widths, including horizontal swipe/scroll, keyboard navigation, active-card visibility, detail replacement, deep links, and floating-control overlap.

