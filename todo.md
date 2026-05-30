# Anodyne Avenue — Website To-do

A working checklist for improving Anodyne Avenue while preserving its minimal, text-first, black-and-white, archive-like style.

Use this as a living backlog. Tick items off, delete rejected ideas, and add notes under each heading as the site develops.

---

## Guiding constraints

- [ ] Preserve the quiet, monochrome, archive-like identity.
- [ ] Avoid large visual redesigns unless there is a specific usability reason.
- [ ] Keep the site static-first.
- [ ] Avoid unnecessary client-side JavaScript.
- [ ] Use British English.
- [ ] Keep Metadata public, but do not add a Metadata item to the sidebar.
- [ ] Keep Tags as part of the metadata system.
- [ ] Preserve existing breadcrumb rules:
  - current page label is not a link;
  - previous breadcrumb levels are links;
  - post breadcrumbs do not repeat the post title.

---

## Priority 1 — Small fixes and immediate improvements

- [ ] Add dividing lines between different cards in the Metadata → By post section.
  - Suggested approach:
    - apply the divider to `.metadata_post_entry + .metadata_post_entry`;
    - do not apply it directly to `.metadata_post_card`;
    - preserve the neutral fragment-target behaviour.

- [ ] Add an About page.
  - Page path: `/about.html`.
  - Sidebar label: `About`.
  - Breadcrumb: `ANODYNE AVENUE / ABOUT`.
  - Suggested position in sidebar:
    - Essays
    - Guides
    - Blog
    - Tags
    - Archive
    - About
  - Alternative position:
    - About immediately under the site title, before Essays.
  - Content should explain:
    - what Anodyne Avenue is;
    - what Essays, Guides, Blog, Tags, Archive mean;
    - why the site is anonymous/pseudonymous;
    - what “revised” means;
    - what editions mean;
    - what the metadata system is for;
    - how to read/use the site.

- [ ] Add previous/next links at the bottom of each post.
  - Should appear after the post body, probably before or after the footer metadata card.
  - Use chronological order across all visible posts.
  - Consider whether the sequence should be:
    - all posts, regardless of type; or
    - only posts within the same type.
  - Suggested initial implementation:
    - previous/next across all visible posts by date.
  - Display style:
    - minimal card or two-row text block;
    - no large visual design;
    - include title and compact date/type metadata.

---

## Priority 2 — Navigation and discoverability

- [ ] Improve the homepage as a navigation hub.
  - Keep “Latest”.
  - Add a small “Browse” section with cards/rows for:
    - Essays;
    - Guides;
    - Blog;
    - Tags;
    - Archive;
    - About.
  - Keep it quiet and text-first.

- [ ] Add active/current page styling in the sidebar.
  - The current section should be visually distinguishable.
  - Keep it subtle:
    - slightly darker text;
    - maybe `background: var(--line)`;
    - no loud colours.

- [ ] Add section summaries to the archive or homepage.
  - Example:
    - Essays — long-form investigations.
    - Guides — structured explanations and methods.
    - Blog — shorter entries, fragments, logs.
  - These already exist conceptually in the generator; make them more discoverable.

- [ ] Add year groupings to the Archive.
  - Example:
    - 2027
    - 2026
  - This will become more useful once the archive grows.

- [ ] Add type groupings or filters to the Archive.
  - Essays / Guides / Blog.
  - Could be static links or client-side filter buttons.
  - Static-first option:
    - generate `/archive/essays.html`;
    - generate `/archive/guides.html`;
    - generate `/archive/blog.html`.

- [ ] Add a “Browse by year” section.
  - Could use generated archive year pages:
    - `/archive/2026.html`;
    - `/archive/2027.html`.

- [ ] Add a “Browse by revised date” route later if revisions become important.
  - This may already be partially covered through `/metadata/revised.html`.

---

## Priority 3 — Archive searchability

- [ ] Add archive search.
  - Search fields:
    - title;
    - abstract;
    - tags;
    - type;
    - date;
    - revised date;
    - extra public metadata fields.
  - First version can be client-side JavaScript because the archive is static HTML.
  - Keep it optional: the page should still show all posts without JavaScript.

- [ ] Add archive filters.
  - Filter by:
    - type;
    - tag;
    - year;
    - revised/unrevised;
    - edition/status, if useful.
  - Keep filters visually minimal.

- [ ] Add archive sort controls.
  - Newest first.
  - Oldest first.
  - Title A–Z.
  - Word count, if useful.

- [ ] Consider generating a machine-readable search index.
  - Example: `/search-index.json`.
  - It could include:
    - title;
    - URL;
    - type;
    - date;
    - revised;
    - abstract;
    - tags;
    - word count;
    - selected metadata.
  - This would keep search logic simple and avoid parsing the DOM.

---

## Priority 4 — RSS and feeds

- [ ] Add a main RSS or Atom feed.
  - Suggested path:
    - `/feed.xml`
  - Purpose:
    - lets readers subscribe to new posts using a feed reader;
    - does not require social media, email newsletters, or accounts;
    - fits the archive-like identity of the site.
  - Include:
    - site title;
    - site URL;
    - site description;
    - latest visible posts;
    - post title;
    - post URL;
    - post date;
    - revised date if present;
    - abstract;
    - maybe full body later, but summary-only is fine initially.

- [ ] Add feed discovery in the HTML head.
  - Example:
    - `<link rel="alternate" type="application/rss+xml" title="Anodyne Avenue" href="/feed.xml">`

- [ ] Add per-section feeds.
  - Suggested paths:
    - `/essays/feed.xml`;
    - `/guides/feed.xml`;
    - `/blog/feed.xml`.
  - Purpose:
    - lets readers subscribe only to essays, only to guides, or only to blog posts.
  - These are useful if the sections become meaningfully different in tone and frequency.

- [ ] Consider tag feeds later.
  - Example:
    - `/metadata/tags/physics/feed.xml`.
  - Park until the site has enough posts.

---

## Priority 5 — Canonical URLs, robots, and discovery hygiene

- [ ] Add canonical URLs to every generated page.
  - A canonical URL is the preferred official URL for a page.
  - It helps search engines and feed readers understand which URL is the main version when duplicates or compatibility pages exist.
  - Especially relevant for:
    - `/tags.html` pointing to `/metadata/tags.html`;
    - metadata entry pages;
    - post pages;
    - archive and section pages.

- [ ] Add canonical link support to the `shell()` function.
  - Possible API:
    - `canonical: "archive.html"`
    - or `canonical: absolute_url("archive.html")`
  - Output:
    - `<link rel="canonical" href="https://anodyneavenue.github.io/archive.html">`

- [ ] Give `/tags.html` a canonical URL pointing to `/metadata/tags.html`.
  - Since `/tags.html` is only a compatibility page, this is a good use of canonical URLs.

- [ ] Generate `robots.txt`.
  - Suggested content:
    - `User-agent: *`
    - `Allow: /`
    - `Sitemap: https://anodyneavenue.github.io/sitemap.xml`
  - Note:
    - the site already generates a sitemap;
    - verify whether `robots.txt` is currently generated before assuming it exists.

- [ ] Keep the sitemap updated.
  - Include:
    - homepage;
    - section pages;
    - archive;
    - about;
    - metadata pages;
    - tag/metadata entry pages;
    - post pages;
    - feeds, if desired.

---

## Priority 6 — Post reading flow

- [ ] Add previous/next post navigation.
  - See Priority 1.
  - Decide whether this is:
    - chronological across the whole site;
    - chronological within the same section;
    - both.

- [ ] Add “Back to archive” link near the bottom of posts.
  - Could be redundant if previous/next exists.
  - Keep only if it improves navigation.

- [ ] Add print styling for essays/guides.
  - Useful for long-form reading.
  - Hide:
    - sidebar;
    - buttons;
    - minimap;
    - non-essential navigation.
  - Preserve:
    - title;
    - date/type/revised;
    - body;
    - references/footnotes.

- [ ] Add footnote/reference styling.
  - Particularly useful for essays.
  - Can remain hand-authored HTML for now.

---

## Priority 7 — Metadata system refinements

- [ ] Keep metadata cross-links parked for now.
  - Future idea:
    - make metadata values inside By-post rows link to their corresponding metadata entry pages.
  - Do not implement until the base navigation and archive search are stable.

- [ ] Consider adding a short explanatory sentence to `/metadata.html`.
  - Explain that Metadata is public but intentionally not in the sidebar.
  - Explain that Tags are a metadata field.

- [ ] Consider a “metadata field legend”.
  - Define:
    - slug;
    - title;
    - type;
    - date;
    - revised;
    - tags;
    - abstract;
    - word count;
    - edition;
    - status;
    - confidence;
    - series;
    - scope.

- [ ] Remove unused legacy tag helper code later.
  - Only after confirming there is no build dependency.
  - Do not prioritise this over user-facing features.

---

## Parked ideas

- [ ] Related posts.
  - Generate from shared tags, series, or metadata.
  - Park until there are enough posts for it to be useful.

- [ ] Metadata cross-links inside By-post rows.
  - Useful, but not urgent.

- [ ] Tag-specific feeds.
  - Useful later, unnecessary now.

- [ ] Full-text search across post bodies.
  - Useful later.
  - Might require a larger search index.

- [ ] Markdown input support.
  - Potentially useful, but not necessary while the site is small.
  - Avoid unless hand-writing HTML becomes too slow.

- [ ] Comments.
  - Probably not aligned with the quiet archive identity.

- [ ] Newsletter.
  - RSS is a better first step.

---

## Quality checks after each change

- [ ] `node --check build.js` passes.
- [ ] `node build.js` passes.
- [ ] Generated pages appear in `_site/`.
- [ ] Sidebar still works on desktop.
- [ ] Sidebar still works on mobile.
- [ ] Breadcrumbs follow the current rules.
- [ ] Current breadcrumb labels do not link to themselves.
- [ ] Metadata pages still build when there are no visible posts.
- [ ] User-facing metadata says “entries”, not “values”.
- [ ] `/metadata/tags.html` remains the canonical tags page.
- [ ] `/tags.html` remains a compatibility page.
- [ ] Post-footer metadata cards still link to `/metadata.html#post_metadata_[slug]`.
- [ ] No target-highlight/white-ring bug returns.
- [ ] Minimap markers still use `/`, `>`, `>>`, `>>>`.
- [ ] Sitemap includes any newly generated pages.
- [ ] RSS/feed XML validates after feed support is added.
- [ ] `robots.txt` is generated after robots support is added.
- [ ] Canonical URLs are correct after canonical support is added.

---

## Suggested implementation order

1. Add By-post dividers.
2. Add About page and sidebar link.
3. Add previous/next links on posts.
4. Add main RSS/Atom feed.
5. Add canonical URLs.
6. Add `robots.txt`.
7. Add archive search/filtering.
8. Add per-section feeds.
9. Add archive year/type pages.
10. Reassess metadata cross-links and related posts.
