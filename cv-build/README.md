# CV PDF build source

> **As of 2026-09-12 the published PDF (`documents/Robinson_Vidva_CV.pdf`) is generated from the
> Career Hub CV builder (`Career Hub/09_Backup/scripts/build_cv.py`, run with `DEID=1`), which
> produces the de-identified public version of the same CV used for applications: no phone number,
> no personal email (hello@robinsonvidva.com only), location "Washington, DC area", references
> "available on request". Copy the resulting PDF into `documents/` and bump the `?v=` cache-buster
> in `cv.html`. The `cv_source.html` + `build.js` pipeline below is retained for reference only and
> is no longer the authoritative source.

This folder holds the source that generates `documents/Robinson_Vidva_CV.pdf`.

It lives on `main` alongside the site but is **not linked anywhere** — it does not appear
in the navigation menu, the sitemap, or on any page. It is excluded from search engines
via `robots.txt` (`Disallow: /cv-build/`). Note: because the repo uses `.nojekyll`,
files here are still technically reachable by direct URL; there is nothing private in the
CV, so that's fine, but don't put anything sensitive in this folder.

## Files
- `cv_source.html` — the styled, print-ready CV (single column, US Letter, serif). **Edit this.**
- `build.js` — renders `cv_source.html` to a PDF via headless Chromium.

## Regenerate the PDF
```
cd cv-build
npm i playwright        # once
node build.js           # writes Robinson_Vidva_CV.pdf into this folder
cp Robinson_Vidva_CV.pdf ../documents/Robinson_Vidva_CV.pdf
```
Then commit `documents/Robinson_Vidva_CV.pdf` and push.

## Conventions to keep
- **PII-safe:** location is "Washington, DC area" and contact is hello@robinsonvidva.com only
  — no phone number, no personal Gmail.
- The author's name (`Vidva R`) is **bold** in every citation (standard academic convention).
- DOIs, patents, and profile links are real `<a href>` tags — they become clickable
  annotations in the PDF automatically.
- Each role / reference uses `break-inside: avoid` so entries don't split across pages.
