# SFA Research Recognition Design

## Intent

Add a credible, accessible reference to the 26 April 2021 Singapore Food Agency media release on the Projects page. The feature should show that NUS and E and ST Environmental Pte Ltd were listed as the team for “Achieving a sustainable aquaculture environment by specialized microbes,” without implying that E&ST alone received the grant call's full S$23 million.

## Goals

- Place a concise “Research Recognition” feature on the Projects page between the hero and current project content.
- Provide an HTML summary that is readable, responsive, and useful to search engines and assistive technology.
- Preserve the supplied four-page SFA PDF unchanged and open it in a new tab from a clearly labelled link.
- Label the source and date: Singapore Food Agency, 26 April 2021.
- Show the PDF metadata in the call to action: PDF, 4 pages, approximately 184 KB.

## Non-goals and anti-goals

- Do not present this as a new announcement or current funding round.
- Do not claim E&ST received S$23 million; that amount covers 12 awarded projects.
- Do not imply SFA endorsement of E&ST.
- Do not extract or reuse the SFA logo as E&ST branding.
- Do not build an inline PDF viewer or a full project case study without additional verified project information.

## Approved approach

Create one editorial recognition feature using the site's existing typography, color, spacing, button, and reveal patterns. The left side carries source/date and headline; the right side provides the factual summary and PDF action. Copy the original document unchanged to `public/documents/sfa-sustainable-aquaculture-media-release-2021.pdf`.

## Alternatives considered

1. **Featured Projects-page recognition (selected):** Gives the source enough context, supports accessibility and SEO, and fits the site's current evidence-led Projects page.
2. **PDF-only link:** Smaller implementation, but visitors would receive no context and the content would be weaker for accessibility and discovery.
3. **Standalone case-study page:** Stronger storytelling, but the available source does not contain enough verified E&ST-specific project detail to support it safely.

## Constraints

- Use the existing React/Vite codebase and design tokens; add no dependency.
- Keep the PDF byte-for-byte identical to the supplied file.
- The feature must work at desktop and 390px mobile widths without clipping or horizontal overflow.
- Existing homepage, project cards, floating controls, and staging behavior must remain unchanged.

