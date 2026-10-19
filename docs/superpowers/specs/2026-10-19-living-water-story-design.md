# Living Water Portal-to-Waterline Design

Date: 2026-10-19

## Objective

Refine only the homepage hero and its handoff into the first homepage content section. The visitor begins outside a circular water system, looks through an organic portal, moves into that portal through normal scrolling, arrives at a full-width waterline scene, and then continues into the explanation of the circular treatment system.

The experience must use the existing `/images/home-hero-wastewater.webp` image throughout the transformation. It must not depend on swapping between pre-composed scene images, WebGL, Three.js, GSAP, or a new animation dependency.

## Current-State Diagnosis

The working tree currently contains two separate scroll sequences:

1. `Hero` uses a supplied full-bleed image instead of a distinct organic portal.
2. `PortalTransitionScene` is a second sticky sequence that crossfades between static images.

This creates two unrelated scenes, adds excessive scroll distance, and cannot communicate one continuous movement through the same portal. `HeroWaterEffect` contains useful ripple and droplet behavior but is not used by the current hero. The global `WaterRippleTrail` and `NavigationWaterTransition` are separate site-wide systems and should remain unchanged.

## Selected Approach

Use one sticky `WaterStoryScroll` sequence with a single normalized progress value from `0` to `1`. A lightweight controller writes progress and derived values directly to CSS custom properties with a passive scroll listener and `requestAnimationFrame`.

The visual is built from:

- an SVG-clipped portal using the existing wastewater image;
- CSS transforms and an interpolated SVG mask for portal expansion;
- a full-width duplicate of the same image for the immersion stage;
- an irregular SVG waterline over a layered CSS underwater treatment;
- a small canvas dedicated to click/tap ripples and occasional droplets;
- CSS gradients for underwater depth, caustics, rays, and the final fade to white.

This approach provides a continuous transformation while keeping layout, paint cost, and bundle size controlled.

## Component Architecture

### `Hero.tsx`

Owns the semantic hero content and assembles the water story. It remains readable and contains no scroll calculations.

Responsibilities:

- headline, description, and existing CTA destinations;
- accessible representative-image description;
- `WaterStoryScroll` wrapper;
- `LivingWaterPortal` visual;
- `WaterSurface` immersion layer;
- scroll indicator.

### `WaterStoryScroll.tsx`

Owns scroll progress and activity state without React state updates during scrolling.

Responsibilities:

- calculate progress from the wrapper's absolute document position and scrollable range;
- schedule writes through a single `requestAnimationFrame` callback;
- write `--water-progress` and derived stage properties directly to the story root;
- use passive `scroll` and `resize` listeners;
- set `data-active` through `IntersectionObserver` so nonessential animations pause off-screen;
- respond to `prefers-reduced-motion` changes;
- clean up frames, observers, and listeners.

Desktop wrapper height will be approximately `200vh`, capped so the interaction does not feel trapped. Mobile height will be approximately `150vh`. The sticky stage occupies one viewport.

### `LivingWaterPortal.tsx`

Owns the initial portal, image, liquid edge, decorative droplets, and click/tap ripple canvas.

Responsibilities:

- display `/images/home-hero-wastewater.webp` with meaningful alternative text;
- use an SVG clip path whose same-command path coordinates interpolate from organic portal to wide opening to viewport rectangle;
- provide transparent outer water, inner highlight, and edge-refraction layers;
- accept pointer interaction only within the visible portal region;
- render two or three elliptical ripple rings at the pointer position;
- limit ambient droplets to a maximum of six;
- cap canvas DPR at `2`;
- pause canvas and CSS animation when inactive, hidden, or reduced-motion is enabled.

The SVG path interpolation is performed from small numeric point arrays, not React state. Only the path attribute and CSS variables are changed per scheduled frame.

### `WaterSurface.tsx`

Owns the waterline and underwater atmosphere that becomes visible after the portal reaches the viewport edges.

Responsibilities:

- render two low-amplitude SVG wave paths with translucent white and cyan highlights;
- place the initial waterline at approximately 60% of viewport height;
- move the waterline toward approximately 23% during the final stage;
- create underwater depth with layered teal-to-navy gradients rather than a flat overlay;
- add low-opacity caustics, diagonal light rays, and 8–12 CSS bubbles;
- lighten the underwater area from blue to pale aqua and then white near progress `1`;
- stop continuous decorative motion when inactive or reduced-motion is enabled.

## Scroll Timeline

All changes interpolate continuously. Stage boundaries describe emphasis rather than hard switches.

### Progress `0.00–0.15`: Initial portal

- text is fully visible;
- portal occupies roughly 55–60% of hero width and 70–80% of visual height;
- dark navy environment remains dominant;
- portal has an asymmetrical liquid boundary and minimal slow motion;
- click/tap ripples and restrained droplets are active.

### Progress `0.15–0.40`: Expansion

- portal scale follows approximately `1`, `1.04`, `1.09`, `1.15`, `1.22` across the first 400 pixels on a typical desktop range;
- portal moves toward the viewport center and stretches horizontally;
- headline moves slightly upward and left;
- description and decorative droplets begin fading;
- buttons remain readable through the early part of this stage.

### Progress `0.40–0.60`: Entering the portal

- the SVG mask expands beyond the original visual column;
- the portal edge softens and approaches the viewport boundaries;
- the image zoom remains below approximately `1.06`;
- hero copy and CTAs fade to near-zero by progress `0.60`;
- the dark environmental background disappears behind the expanding image.

### Progress `0.60–0.80`: Waterline immersion

- portal framing no longer reads as a separate object;
- the image fills the viewport;
- the waterline sits near 60% height;
- the upper portion remains clear treatment and green-infrastructure imagery;
- the lower portion gains depth gradient, subtle refraction, caustics, rays, and bubbles;
- the visual reads as a camera positioned directly at the water surface.

### Progress `0.80–1.00`: Handoff to content

- waterline rises toward 23% height;
- underwater blue lightens through pale aqua to white;
- bubbles, caustics, and remaining portal highlights fade;
- the bottom of the sticky stage becomes the same white as `ChallengeSection`;
- the story releases into the existing “Water Shouldn’t End After Treatment” content without an abrupt image edge or white flash.

## Next-Section Integration

`ChallengeSection` retains its factual content and structure. Its top edge receives only the minimal pale-aqua transition treatment required to continue the water clearing effect. `ProcessSection` retains the existing five stages and animated process line.

The optional aqua continuation line will not be implemented in this pass. The water-to-white transition will provide the handoff without restructuring the existing Challenge or Process sections.

## Header and Global Effects

- The existing header structure and navigation destinations remain unchanged.
- The unscrolled homepage header remains transparent and light over the dark initial hero.
- The existing scrolled white header remains available as the scene brightens.
- `WaterRippleTrail` remains global and unchanged. The portal ripple remains visually localized and more prominent inside the portal.
- `NavigationWaterTransition` remains unchanged.
- `Floating3DParticles` stays removed from the homepage hero.
- `HeroWaterEffect` will be refactored or retired after its useful ripple/drop logic is moved into the portal; duplicate effects will not be stacked.

## Responsive Behavior

### Desktop

- one sticky story around `190–210vh`;
- text left and portal right at progress `0`;
- full morph, waterline, caustics, rays, and up to 12 bubbles.

### Tablet

- retain side-by-side layout while space permits;
- below approximately 900px, stack text above portal;
- use the same normalized sequence with smaller edge effects and no clipping.

### Mobile

- wrapper limited to approximately `140–160vh`;
- text precedes a large organic portal;
- simpler mask interpolation and shorter travel distance;
- reduced image zoom;
- no expensive displacement filter;
- 4–6 bubbles, one occasional droplet, and tap ripple;
- no horizontal overflow or layout jump at 430, 390, 375, or 360 pixels.

## Reduced Motion

When `prefers-reduced-motion: reduce` is active:

- remove the extended sticky scroll distance;
- show a normal static hero with an organic portal;
- show a static wide waterline composition below it;
- disable mask morphing, bubbles, caustic animation, ambient droplets, refraction animation, and scroll-driven transforms;
- preserve navigation, content order, contrast, CTAs, and pointer accessibility.

## Accessibility

- Hero copy remains real HTML.
- The representative image retains meaningful alternative text and is not described as a verified organisation project.
- Decorative waterline, bubbles, rays, caustics, and duplicate image layers are hidden from assistive technology.
- CTA links remain native keyboard-accessible links.
- Motion preference changes are honored without reload.
- Contrast is maintained while copy is visible; copy is removed from the visual before the bright image dominates.

## Performance Constraints

- no new runtime dependencies;
- no WebGL or continuous full-screen canvas;
- one passive scroll listener and one scheduled animation frame for progress writes;
- no React state updates during scroll;
- canvas runs only for active ripples or droplets and caps DPR at `2`;
- CSS decorative animations pause when the story is off-screen or the document is hidden;
- filters remain localized to the portal edge or underwater layer;
- only `/images/home-hero-wastewater.webp` is required for the story.

## Cleanup Scope

Remove the interim separate-scene implementation and its unused generated assets:

- `PortalTransitionScene.tsx` and its tests;
- `living-water-next-scene.webp`;
- `living-water-scene-frame-1.webp`;
- `living-water-scene-frame-2.webp`;
- full-background hero artwork if it is no longer used.

Preserve unrelated working-tree changes and the existing `deploy/` directory.

## Testing and Verification

Automated tests will cover:

- exact semantic hero copy and destinations;
- portal image accessibility;
- normalized progress and stage-derived CSS variables;
- SVG mask interpolation endpoints and midpoint;
- exact pointer-position ripple behavior;
- reduced-motion static behavior;
- listener, observer, timer, and animation-frame cleanup;
- no separate static-scene component on the homepage;
- existing global ripple and navigation transition behavior.

Required commands:

```text
npm test -- --run
npm run typecheck
npm run lint
npm run build
```

Manual viewport verification:

`1920`, `1600`, `1440`, `1366`, `1280`, `1024`, `768`, `430`, `390`, and `360` pixels.

Checks include smooth normal scrolling, image aspect preservation, no clipping or overflow, stable text layout, header contrast, absence of white flashes, reasonable sticky duration, and reduced-motion fallback.
