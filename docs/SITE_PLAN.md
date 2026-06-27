# robinsonvidva.com — Redesign & Restructure Plan

> Working plan captured 2026-06-27. Goal: set up the idea now, build it out next.
> Two parallel streams: (A) restyle the look, (B) restructure into an
> educational/informational "computational-tools scientist" site.
> Everything stays static on **GitHub Pages**.

---

## 1. Vision & guiding principles

Turn the personal academic portfolio into a **useful, educational hub** that
showcases the tools Robinson builds and invites people to actually use them —
while reading clearly as the site of a *computational-tools-development
scientist*, not a generic AI-built template.

**Design philosophy (how we avoid the "AI-built" look):**
- Keep the existing **teal palette** and overall calm, professional feel.
- Sharpen typographic hierarchy; modernize the dated buttons/cards/spacing.
- Lean into a developer-scientist identity: **monospace accents** for tool/code
  names, **real screenshots** of the tools, **tech/language badges**, restraint.
- Avoid AI-builder tells: no gradient-blob hero, no emoji-spam feature grids,
  no glassmorphism, no SaaS "Get Started" CTAs, no fake testimonials.

**Hard constraints:**
- Static only (GitHub Pages). No server — forms/analytics need 3rd-party services.
- **Preserve all existing functionality** during any redesign (see §6).

---

## 2. Decisions

### Settled (default unless changed)
- **Stay on GitHub Pages**, static.
- **Redesign approach:** use **Claude Design as a *design system*** (component
  kit), synced via `/design-sync`, then hand-applied to existing markup —
  **NOT** a wholesale AI page-replacement. This preserves functionality and
  avoids the generic AI look. (See §6.)
- **Tracking:** keep Google Analytics + the existing `views.json` pipeline, and
  *surface it better* (per-page and per-tool view counts on the site).
- **Consolidate** CV + Certifications into one **About** page.

### Open (decide before/at build time)
- [ ] **Sequencing:** restructure-first (recommended) vs restyle-first vs both-together.
- [ ] **Research/publications/patents placement:** keep dedicated **Research**
      page (recommended) vs section in About vs fold into Projects timeline.
- [ ] **Projects vs Tools boundary** (see §4) — confirm the split.
- [ ] **Contact form backend:** Formspree free tier (recommended) vs Google Form
      embed vs mailto-only.
- [ ] **Personal/community repos** (GraceDesk, readin52, thalaimuraigal): include
      on the professional site, or leave off / link from a small "Other" area?
- [ ] **Claude Design workspace:** start a new design-system project or reuse an
      existing one (requires connecting claude.ai/design login at build time).

---

## 3. Proposed information architecture

```
Home  ·  About  ·  Research  ·  Projects  ·  Tools  ·  Articles  ·  Contact
```

| Page | Purpose | Replaces / from |
|------|---------|-----------------|
| **Home** | Concise landing: who, the focus areas, featured tools, recent work | index.html |
| **About** | One definitive page: bio, work history detail, skills, education, **certifications**, CV PDF download | cv.html + certifications.html (merged) |
| **Research** | Publications, presentations, patents (keep filter/search/sort) | research.html (kept) |
| **Projects** | Chronological, non-boring story of work/projects & impact | NEW |
| **Tools** | Showcase + how-to-use for the software Robinson built (from GitHub) | NEW |
| **Articles** | Long-form articles (as today) | articles.html (kept) |
| **Contact** | Contact form + links | NEW |

---

## 4. The two pages that need the most design+content work

### Projects (chronological work)
- A **readable timeline** (not a wall of text): year/period → role/context →
  what was built → outcome/impact, with links out to papers/tools where relevant.
- Make it scannable: compact cards or a vertical timeline with tags
  (e.g. `neuro`, `immuno-oncology`, `tooling`, `multi-omics`).
- Distinct from Tools: **Projects = the story/career**; **Tools = the products.**

### Tools (the "everyone should use this" hub)
- Sourced from GitHub repos (see §5). Each tool gets a card:
  **name (monospace) · one-liner · tech badges · screenshot · [Open] [GitHub] ·
  short "how to use".**
- Group by usage type: **Web tools (use now) / Platforms / Pipelines & code.**
- Consider a brief "how to use" section or modal per tool; the live web tools
  can deep-link straight into the running app.

---

## 5. Tools inventory (pulled from GitHub, robinson-vidva)

### Live web tools — client-side, ready to feature
| Tool | One-liner | Live | Repo lang |
|------|-----------|------|-----------|
| `DrugInteract` | Educational drug-interaction reference (FDA labels), no backend | robinsonvidva.com/DrugInteract/ | JS |
| `enrichlite` | In-browser gene-set ORA (GO, Hallmark, Reactome) | robinsonvidva.com/enrichlite/ | JS |
| `drugtargets` | Drug-target exploration & repurposing (Open Targets + openFDA) | drugtargets.robinsonvidva.com | TS |
| `kineneo-demo` | Live MediaPipe pose skeleton overlay | robinsonvidva.com/kineneo-demo/ | JS |

### Platforms
| Tool | One-liner | Live | Repo lang |
|------|-----------|------|-----------|
| `MyVivarium` | Cloud vivarium colony management + IoT sensing (CSBJ 2025) | demo2.myvivarium.online | PHP |
| `SciGenda` | Open-source lab experiment management platform | — | web |

### Pipelines & research code
| Tool | One-liner | Repo lang |
|------|-----------|-----------|
| `behaviarium` | OpenCV + DeepLabCut + B-SOiD mouse behavior workflow | Python |
| `istoflow` | Reproducible 2D mouse brain histology→atlas pipeline | Python |
| `pose2behavior` | Pose→behavior (needs description) | Python |
| `citelas` | Multi-source citation aggregation & analysis | Python |

### Personal / community (decide whether to include — see §2 Open)
| Project | One-liner |
|---------|-----------|
| `GraceDesk` | Open-source church management system |
| `readin52` | "Scripture in 52 weeks" reading app |
| `thalaimuraigal` | Family-tree website |

> TODO at build time: confirm one-liners, pick screenshots, confirm which repos
> are public/featured, add missing descriptions (pose2behavior, pt-social).

---

## 6. Technical approach

### Redesign via Claude Design (design system, not page-replace)
- Build/refresh a **component kit** on `claude.ai/design` (buttons, cards,
  badges, nav, type scale, teal usage), keep it in a local component library
  via the `/design-sync` skill (incremental, one component at a time).
- **Apply** those styles into the existing HTML/CSS by hand so behavior is
  untouched.

### Functionality to preserve (do NOT regress)
- Research page: filter / search / sort.
- `views.json` view counters (footer total + per-page) fed by the GitHub Action.
- Citation "copy" buttons on article pages.
- Back-to-top, scroll-reveal + count-up (`scripts/enhance.js`), navbar shadow.
- Google Analytics (gtag) + SEO: canonical, Open Graph/Twitter, JSON-LD,
  sitemap.xml, robots.txt, feed.xml.

### Contact form (static-safe)
- Recommended: **Formspree** free tier — drop-in `<form action>`, spam filter,
  emails submissions (~50/mo free). Style it to match the site.

### Tracking (better)
- Keep GA + `views.json`; display **per-tool / per-page** counts on Tools/Home
  to signal real usage. Optionally evaluate a privacy-friendly counter later.

---

## 7. Suggested build order (next session)
1. Confirm the Open decisions in §2.
2. Scaffold new pages (About merge, Projects, Tools, Contact) on current styles
   — content-first.
3. Populate Tools from §5 (screenshots + how-to-use); wire view counts.
4. Build Projects timeline.
5. Connect Claude Design; refresh the component kit; apply site-wide.
6. Add Contact form (Formspree); verify; QA all preserved functionality.
7. Update nav, sitemap.xml, feed.xml, README; redirect old URLs (cv/certs).

## 8. What I need from Robinson
- Confirm §2 Open decisions.
- For each featured tool: final one-liner + a **screenshot** (or OK to capture
  from the live site) + confirm public repo links.
- Decide on personal/community repos inclusion.
- Bio/positioning sentence for Home + About ("computational-tools scientist").
- When ready: connect the claude.ai/design workspace for the design system.
