#!/usr/bin/env python3
"""
apply_stats.py — pushes values from stats.json into the site HTML.

Every auto-updated number on the site is wrapped like:
    <span data-stat="ig_views_30d">28.4K</span>
This script rewrites the text inside each such span to match stats.json.
It is idempotent: running it twice produces the same result.

Usage:
    python3 stats/apply_stats.py            # apply to the pages below
    python3 stats/apply_stats.py --check    # report values, change nothing
"""
import json, re, sys, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)                      # the site root (_deploy)
PAGES = ["content.html", "index.html", "work.html", "portfolio.html", "shop.html"]

def load():
    with open(os.path.join(HERE, "stats.json"), encoding="utf-8") as f:
        return json.load(f)

def main():
    data = load()
    values = data["values"]
    check = "--check" in sys.argv
    total = 0
    for page in PAGES:
        path = os.path.join(ROOT, page)
        if not os.path.exists(path):
            continue
        html = open(path, encoding="utf-8").read()
        original = html
        for key, val in values.items():
            pattern = re.compile(r'(<span data-stat="%s">)(.*?)(</span>)' % re.escape(key))
            def repl(m):
                return m.group(1) + str(val) + m.group(3)
            html, n = pattern.subn(repl, html)
            if n:
                total += n
        if not check and html != original:
            open(path, "w", encoding="utf-8").write(html)
        print(f"{page}: {'would update' if check else 'updated'} tagged stats")
    print(f"\n{total} data-stat span(s) processed. updated={data.get('updated')}")

if __name__ == "__main__":
    main()
