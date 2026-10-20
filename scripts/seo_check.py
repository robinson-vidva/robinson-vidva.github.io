#!/usr/bin/env python3
"""Yoast-style SEO check for the static pages in this repo.

Usage:
  python3 scripts/seo_check.py            # all indexable pages
  python3 scripts/seo_check.py cv.html    # one or more pages
  python3 scripts/seo_check.py --strict   # exit 1 if any check is BAD
  python3 scripts/seo_check.py --summary  # one line per page

Focus keyphrase = first entry of <meta name="keywords"> on the page.
"""
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://robinsonvidva.com"
SKIP_TAGS = {"script", "style", "noscript", "template", "nav", "footer", "svg"}
SKIP_FILES = {"404.html"}

GOOD, OK, BAD = "GOOD", "OK", "BAD"


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.lang = None
        self.title = None
        self.meta = {}
        self.canonical = None
        self.jsonld = []
        self.headings = []
        self.images = []
        self.links = []
        self.paragraphs = []
        self.words = []
        self._stack = []
        self._skip = 0
        self._text_target = None
        self._buf = []
        self._in_ld = False
        self._in_body = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.lang = a.get("lang")
        elif tag == "meta":
            key = a.get("name") or a.get("property")
            if key and "content" in a and key not in self.meta:
                self.meta[key] = a["content"]
        elif tag == "link" and a.get("rel") == "canonical":
            self.canonical = a.get("href")
        elif tag == "script" and a.get("type") == "application/ld+json":
            self._in_ld = True
            self._buf = []
            return
        elif tag == "body":
            self._in_body = True
        if tag in SKIP_TAGS:
            self._skip += 1
        if self._skip or not self._in_body:
            if tag == "title":
                self._text_target = "title"
                self._buf = []
            return
        if tag == "h1" or re.fullmatch(r"h[2-6]", tag):
            self._text_target = tag
            self._buf = []
        elif tag == "p":
            self._text_target = "p"
            self._buf = []
        elif tag == "img":
            self.images.append(a)
        elif tag == "a" and a.get("href"):
            self.links.append(a["href"])

    def handle_endtag(self, tag):
        if tag == "script" and self._in_ld:
            self._in_ld = False
            self.jsonld.append("".join(self._buf))
            return
        if tag in SKIP_TAGS and self._skip:
            self._skip -= 1
            return
        if tag == "title" and self._text_target == "title":
            self.title = clean("".join(self._buf))
            self._text_target = None
        elif self._text_target and tag == self._text_target:
            text = clean("".join(self._buf))
            if tag == "p":
                if text:
                    self.paragraphs.append(text)
            else:
                self.headings.append((int(tag[1]), text))
            self._text_target = None

    def handle_data(self, data):
        if self._in_ld:
            self._buf.append(data)
            return
        if self._skip or not self._in_body:
            if self._text_target == "title":
                self._buf.append(data)
            return
        if self._text_target:
            self._buf.append(data)
        self.words.extend(re.findall(r"[A-Za-z0-9][A-Za-z0-9'\-]*", data))


def clean(s):
    return re.sub(r"\s+", " ", s).strip()


def norm(s):
    return re.sub(r"[^a-z0-9 ]", " ", (s or "").lower())


def stem(w):
    return w[:-1] if len(w) > 3 and w.endswith("s") else w


def contains(haystack, phrase):
    words = {stem(w) for w in norm(haystack).split()}
    needles = [stem(w) for w in norm(phrase).split()]
    return bool(needles) and all(w in words for w in needles)


def parse(path):
    p = Page()
    p.feed(path.read_text(encoding="utf-8"))
    return p


def check(path, page, site_titles, site_descs):
    rel = path.relative_to(ROOT).as_posix()
    is_article = rel.startswith("articles/")
    r = []

    def add(status, name, detail=""):
        r.append((status, name, detail))

    t = page.title or ""
    if not t:
        add(BAD, "Title", "missing")
    elif 30 <= len(t) <= 60:
        add(GOOD, "Title length", f"{len(t)} chars")
    elif len(t) <= 70:
        add(OK, "Title length", f"{len(t)} chars; aim for 30-60")
    else:
        add(BAD, "Title length", f"{len(t)} chars; over 70 is cut off")
    if t and site_titles.get(t, 0) > 1:
        add(BAD, "Title unique", "same title on another page")

    d = page.meta.get("description", "")
    if not d:
        add(BAD, "Meta description", "missing")
    elif 120 <= len(d) <= 156:
        add(GOOD, "Description length", f"{len(d)} chars")
    elif len(d) <= 170:
        add(OK, "Description length", f"{len(d)} chars; aim for 120-156")
    else:
        add(BAD, "Description length", f"{len(d)} chars; over 170 is cut off")
    if d and site_descs.get(d, 0) > 1:
        add(BAD, "Description unique", "same description on another page")

    h1s = [h for lvl, h in page.headings if lvl == 1]
    if len(h1s) == 1:
        add(GOOD, "Single H1", h1s[0][:60])
    else:
        add(BAD, "Single H1", f"{len(h1s)} found")
    prev = 1
    skipped = [(a, b) for a, b in zip([1] + [l for l, _ in page.headings], [l for l, _ in page.headings]) if b > a + 1]
    if skipped:
        add(OK, "Heading order", f"level skipped {skipped[0][0]} to {skipped[0][1]}")
    else:
        add(GOOD, "Heading order", "no skipped levels")
    sub = [h for lvl, h in page.headings if lvl >= 2]
    if len(page.words) > 300 and not sub:
        add(OK, "Subheadings", "long page with no H2-H6")

    missing_alt = [i.get("src", "?") for i in page.images if not i.get("alt", "").strip() and i.get("role") != "presentation"]
    if not page.images:
        add(OK, "Images", "no images in content")
    elif missing_alt:
        add(BAD, "Image alt text", f"{len(missing_alt)} without alt: {missing_alt[0]}")
    else:
        add(GOOD, "Image alt text", f"{len(page.images)} images, all have alt")

    internal = [l for l in page.links if not l.startswith(("http", "mailto:", "tel:", "#", "javascript:")) or l.startswith(SITE)]
    external = [l for l in page.links if l.startswith("http") and not l.startswith(SITE)]
    add(GOOD if internal else BAD, "Internal links", f"{len(internal)} in content")
    add(GOOD if external else OK, "Outbound links", f"{len(external)} in content")

    n = len(page.words)
    lo, hi = (200, 300) if is_article else (80, 150)
    if n >= hi:
        add(GOOD, "Word count", f"{n} words")
    elif n >= lo:
        add(OK, "Word count", f"{n} words; aim for {hi}+")
    else:
        add(BAD, "Word count", f"{n} words; aim for {hi}+")

    c = page.canonical
    if not c:
        add(BAD, "Canonical", "missing")
    elif c.startswith(SITE):
        add(GOOD, "Canonical", c.replace(SITE, ""))
    else:
        add(OK, "Canonical", f"not absolute: {c}")

    og = ["og:title", "og:description", "og:image", "og:url"]
    missing = [k for k in og if k not in page.meta]
    add(GOOD if not missing else OK, "Open Graph", "complete" if not missing else "missing " + ", ".join(missing))
    add(GOOD if "twitter:card" in page.meta else OK, "Twitter card", page.meta.get("twitter:card", "missing"))

    if not page.jsonld:
        add(OK, "Structured data", "no JSON-LD")
    else:
        types = []
        bad = False
        for block in page.jsonld:
            try:
                data = json.loads(block)
            except json.JSONDecodeError as e:
                bad = True
                add(BAD, "Structured data", f"invalid JSON-LD: {e.msg}")
                break
            items = data.get("@graph", [data]) if isinstance(data, dict) else data
            types += [i.get("@type", "?") for i in items if isinstance(i, dict)]
        if not bad:
            add(GOOD, "Structured data", ", ".join(dict.fromkeys(map(str, types))))

    add(GOOD if page.lang else BAD, "Language attribute", page.lang or "missing")
    add(GOOD if "viewport" in page.meta else BAD, "Viewport meta", "present" if "viewport" in page.meta else "missing")

    kw = page.meta.get("keywords", "").split(",")[0].strip()
    if kw:
        add(GOOD, "Focus keyphrase", kw)
        add(GOOD if contains(t, kw) else BAD, "Keyphrase in title", "")
        add(GOOD if contains(d, kw) else OK, "Keyphrase in description", "")
        add(GOOD if h1s and contains(h1s[0], kw) else OK, "Keyphrase in H1", "")
        first = page.paragraphs[0] if page.paragraphs else ""
        add(GOOD if contains(first, kw) else OK, "Keyphrase in first paragraph", first[:60])
        slug = path.stem.replace("-", " ") if path.name != "index.html" else "home"
        add(GOOD if contains(slug, kw) else OK, "Keyphrase in URL", slug)
        if n:
            text = " ".join(page.words)
            hits = len(re.findall(re.escape(norm(kw).strip()), norm(text)))
            dens = 100 * hits / n
            if 0.5 <= dens <= 3:
                add(GOOD, "Keyphrase density", f"{hits} uses, {dens:.1f}%")
            else:
                add(OK, "Keyphrase density", f"{hits} uses, {dens:.1f}%; aim for 0.5-3%")
    else:
        add(OK, "Focus keyphrase", "none; add <meta name=\"keywords\"> with the keyphrase first")
    return rel, r


def pages_to_check(args):
    if args:
        return [ROOT / a for a in args]
    files = sorted(ROOT.glob("*.html")) + sorted((ROOT / "articles").glob("*.html"))
    return [f for f in files if f.name not in SKIP_FILES]


def main():
    argv = sys.argv[1:]
    strict = "--strict" in argv
    summary = "--summary" in argv
    args = [a for a in argv if not a.startswith("--")]
    parsed = []
    for f in pages_to_check(args):
        p = parse(f)
        if "noindex" in p.meta.get("robots", ""):
            print(f"skip {f.relative_to(ROOT).as_posix()} (noindex)")
            continue
        parsed.append((f, p))
    titles, descs = {}, {}
    for _, p in parsed:
        titles[p.title] = titles.get(p.title, 0) + 1
        dd = p.meta.get("description")
        descs[dd] = descs.get(dd, 0) + 1

    any_bad = False
    for f, p in parsed:
        rel, results = check(f, p, titles, descs)
        counts = {s: sum(1 for st, _, _ in results if st == s) for s in (GOOD, OK, BAD)}
        any_bad |= counts[BAD] > 0
        verdict = BAD if counts[BAD] else (OK if counts[OK] else GOOD)
        line = f"{rel}: {verdict}  good={counts[GOOD]} ok={counts[OK]} bad={counts[BAD]}"
        if summary:
            print(line)
            continue
        print("=" * len(line))
        print(line)
        print("=" * len(line))
        for st, name, detail in results:
            print(f"  [{st:<4}] {name}" + (f": {detail}" if detail else ""))
        print()
    sys.exit(1 if strict and any_bad else 0)


if __name__ == "__main__":
    main()
