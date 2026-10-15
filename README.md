# Wastewater Treatment

Interactive six-page environmental research website connecting wastewater treatment, resource recovery, green-wall research, and greener buildings.

## Pages

- Home: `https://xuen00915.github.io/wastewater/`
- Services: `https://xuen00915.github.io/wastewater/services/`
- Research: `https://xuen00915.github.io/wastewater/research/`
- Projects: `https://xuen00915.github.io/wastewater/projects/`
- Collaborate: `https://xuen00915.github.io/wastewater/collaborate/`
- Career: `https://xuen00915.github.io/wastewater/career/`

Services includes a keyboard-accessible interactive treatment pathway. It presents a generic research sequence rather than a universal or proprietary treatment train.

## Local development

Requires Node.js 24 or later.

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm test -- --run
npm run typecheck
npm run lint
npm run build
```

## GitHub Pages

Pushing `main` runs `.github/workflows/deploy-pages.yml` and publishes all six Vite HTML entries. In the repository settings, choose **GitHub Actions** as the Pages source.

Production builds set `base` to `/wastewater/`; local development uses `/`. Keep internal URLs generated through `pageHref` in `src/site.ts` so both environments remain valid.

## Updating content

- Temporary organisation name: `Wastewater Treatment`
- Page routing and metadata: `src/site.ts`
- Repeated page content: `src/data/content.ts`
- Page compositions: `src/pages/`
- Section components: `src/components/`
- Treatment interaction: `src/components/TreatmentPathway.tsx`
- Design tokens: `src/styles/tokens.css`
- Representative imagery: `public/images/`
- Image credits and replacement notes: `public/images/IMAGE-SOURCES.md`

Replace these representative images with verified organisation photography when available:

- `/images/home-hero-wastewater.webp`
- `/images/research-liquid-treatment.webp`
- `/images/research-solid-treatment.webp`
- `/images/research-green-wall.webp`
- `/images/home-green-wall.webp`
- `/images/project-pilot-treatment.webp`
- `/images/project-resource-recovery.webp`
- `/images/project-green-wall.webp`

The current images are generic, rights-cleared visual references and must not be described as organisation projects, locations, partners, or outcomes.
