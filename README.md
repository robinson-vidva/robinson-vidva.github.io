# robinsonvidva.com

Personal site for Robinson Vidva — computational biologist with 18+ years of experience in bioinformatics, multi-omics data analysis, neuroscience, immunology, immuno-oncology, and drug discovery. Beyond the portfolio, the site is a hub for the free, open-source computational-biology tools he builds.

**Live site:** [robinsonvidva.com](https://robinsonvidva.com)

## Pages

| Page | Description |
|------|-------------|
| [Home](https://robinsonvidva.com/) | Overview, research highlights, featured tools, and latest work |
| [CV](https://robinsonvidva.com/cv.html) | Work experience, education, skills, certifications, and CV PDF |
| [Research](https://robinsonvidva.com/research.html) | Publications, preprints, presentations, and patents (filter/search/sort) |
| [Projects](https://robinsonvidva.com/projects.html) | Chronological tour of major projects and what they produced |
| [Tools](https://robinsonvidva.com/tools.html) | Free, open-source tools — many run entirely in the browser |
| [Articles](https://robinsonvidva.com/articles.html) | Long-form articles on computational biology topics |
| [Contact](https://robinsonvidva.com/contact.html) | Contact form (Formspree + Cloudflare Turnstile) and profiles |

> Certifications were merged into the CV page; `certifications.html` now redirects to `cv.html#certifications`.

## Tools

- **[DrugInteract](https://robinsonvidva.com/DrugInteract/)** — educational drug-interaction reference (FDA labels), client-side.
- **[enrichlite](https://robinsonvidva.com/enrichlite/)** — in-browser gene-set over-representation analysis (GO, Hallmark, Reactome).
- **[drugtargets](https://drugtargets.robinsonvidva.com)** — drug-target exploration & repurposing (Open Targets + openFDA).
- **[neokine](https://robinsonvidva.com/neokine/)** — client-side MediaPipe pose visualization with simple kinematics (angles, velocity, asymmetry).
- **[neokine-labs](https://robinsonvidva.com/neokine-labs/)** — experimental MediaPipe Holistic pose/face playground.
- **[MyVivarium](https://demo.myvivarium.online)** — open-source vivarium colony management with IoT sensing (CSBJ 2025); a v2 redesign is in development.

## Articles

- **[Drug Repositioning Through Computational Modeling](https://robinsonvidva.com/articles/drug-repositioning-computational-approaches.html)** — how computational modeling enables drug repositioning from autoimmune disease to oncology to natural-compound integration for enhanced cancer therapy.
- **[MyVivarium: Streamlining Lab Animal Colony Management](https://robinsonvidva.com/articles/myvivarium-lab-animal-management.html)** — an open-source, cloud-based application for managing research animal colonies with IoT-based environmental monitoring. Published in *Computational and Structural Biotechnology Journal*.

## Tech Stack

- HTML5, CSS3, vanilla JavaScript (no build step)
- [Bootstrap 5.3](https://getbootstrap.com/)
- [DM Sans](https://fonts.google.com/specimen/DM+Sans) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (Google Fonts)
- [Font Awesome 6](https://fontawesome.com/)
- [Formspree](https://formspree.io/) (contact form) + [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) (bot protection)
- GitHub Pages with custom domain
- Google Analytics (gtag.js); per-page view counts written to `views.json` by a GitHub Action

## Structure

```
├── index.html              # Home page
├── cv.html                 # CV + certifications
├── research.html           # Publications, preprints, presentations, patents
├── projects.html           # Project timeline
├── tools.html              # Tools showcase
├── articles.html           # Articles listing
├── contact.html            # Contact form + profiles
├── certifications.html     # Redirect → cv.html#certifications
├── terms.html              # Terms of use & privacy policy
├── 404.html                # Custom error page
├── articles/               # Individual article pages
│   ├── drug-repositioning-computational-approaches.html
│   └── myvivarium-lab-animal-management.html
├── scripts/
│   ├── enhance.js          # Progress bar, scroll-reveal, count-up
│   └── fetch_ga_views.py   # GA → views.json (run by GitHub Action)
├── style.css               # Site-wide stylesheet
├── images/                 # Logo, favicons, PWA icons
├── documents/              # Downloadable files (CV PDF)
├── favicon.ico             # Multi-size favicon
├── site.webmanifest        # PWA manifest
├── sitemap.xml             # XML sitemap
├── feed.xml                # RSS feed for articles
├── robots.txt              # Crawler directives
├── views.json              # Page view counts (auto-updated)
└── CNAME                   # Custom domain config
```

## Accessibility & SEO

- Semantic `<main>` landmark and skip-to-content link on every page
- `prefers-reduced-motion` honored for all animations
- Schema.org structured data: Person, ScholarlyArticle, CollectionPage, SoftwareApplication, BreadcrumbList, ContactPage
- Open Graph and Twitter Card meta tags, canonical URLs, author tags
- XML sitemap, RSS feed, and robots.txt

## License

All rights reserved. Content and code are the intellectual property of Robinson Vidva.
