#!/usr/bin/env python3
"""Regenerate sitemap.xml with lastmod taken from git history.

Usage: python3 scripts/build_sitemap.py
"""
import subprocess
from datetime import date
from pathlib import Path

SITE = "https://robinsonvidva.com"
ROOT = Path(__file__).resolve().parent.parent

# (path, changefreq, priority); path is a file in this repo
PAGES = [
    ("index.html", "monthly", "1.0"),
    ("cv.html", "monthly", "0.9"),
    ("research.html", "monthly", "0.9"),
    ("projects.html", "monthly", "0.8"),
    ("tools.html", "monthly", "0.8"),
    ("articles.html", "weekly", "0.8"),
    ("contact.html", "yearly", "0.6"),
    ("terms.html", "yearly", "0.3"),
]

# Tools served from other repos on the same host; no git history here, so no lastmod
EXTERNAL = [
    ("/enrichlite/", "monthly", "0.7"),
    ("/DrugInteract/", "monthly", "0.7"),
    ("/neokine/", "monthly", "0.6"),
    ("/neokine-labs/", "monthly", "0.5"),
]


def git_lastmod(path):
    dirty = subprocess.run(
        ["git", "status", "--porcelain", "--", path],
        cwd=ROOT, capture_output=True, text=True, check=True,
    ).stdout.strip()
    if dirty:
        return date.today().isoformat()
    out = subprocess.run(
        ["git", "log", "-1", "--format=%ad", "--date=short", "--", path],
        cwd=ROOT, capture_output=True, text=True, check=True,
    ).stdout.strip()
    return out or None


def url_for(path):
    return SITE + "/" if path == "index.html" else f"{SITE}/{path}"


def entry(loc, lastmod, changefreq, priority):
    lines = [f"    <loc>{loc}</loc>"]
    if lastmod:
        lines.append(f"    <lastmod>{lastmod}</lastmod>")
    lines.append(f"    <changefreq>{changefreq}</changefreq>")
    lines.append(f"    <priority>{priority}</priority>")
    return "  <url>\n" + "\n".join(lines) + "\n  </url>"


def main():
    entries = []
    for path, freq, prio in PAGES:
        entries.append(entry(url_for(path), git_lastmod(path), freq, prio))
    for article in sorted((ROOT / "articles").glob("*.html")):
        rel = article.relative_to(ROOT).as_posix()
        entries.append(entry(url_for(rel), git_lastmod(rel), "yearly", "0.6"))
    for path, freq, prio in EXTERNAL:
        entries.append(entry(SITE + path, None, freq, prio))

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(entries)
        + "\n</urlset>\n"
    )
    (ROOT / "sitemap.xml").write_text(xml, encoding="utf-8")
    print(f"wrote sitemap.xml with {len(entries)} urls")


if __name__ == "__main__":
    main()
