# Wastewater Treatment

Interactive environmental research homepage connecting wastewater treatment, resource recovery, green-wall research, and greener buildings.

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

Pushing `main` runs `.github/workflows/deploy-pages.yml` and publishes the Vite build. In the repository settings, choose **GitHub Actions** as the Pages source. The deployment URL is expected to be:

`https://xuen00915.github.io/wastewater/`

## Updating content

- Temporary organisation name: `Wastewater Treatment`
- Repeated homepage content: `src/data/content.ts`
- Section components: `src/components/`
- Design tokens: `src/styles/tokens.css`
- Representative imagery and sources: `public/images/`

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
