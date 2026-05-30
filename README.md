# Anodyne Avenue

Pseudonym.

anodyneavenue.github.io

## Purpose

An anonymous, text-first archive of essays, guides, and blog posts.

The site is deliberately minimal, quiet, black-and-white, and archive-like.

## Structure

Source files:

posts.js        post source data
build.js        static site generator
sidebar.js      sidebar interaction only
style.css       visual layout and responsive behaviour
package.json    build command
tools/          local development and diagnostic scripts
.github/        GitHub Pages build workflow

Generated site:

_site/index.html
_site/essays.html
_site/guides.html
_site/blog.html
_site/archive.html
_site/about.html
_site/metadata.html
_site/metadata/       public metadata field and entry pages, including tags
_site/feed.xml        main RSS feed
_site/essays/feed.xml section RSS feed
_site/guides/feed.xml section RSS feed
_site/blog/feed.xml   section RSS feed
_site/robots.txt
_site/sitemap.xml
_site/search-index.json future archive search/filtering data
_site/posts/

The generated _site folder is published by GitHub Actions.

Local development diagnostics are written outside the public site:

_dev/site-skeleton.txt
_dev/site-graph.json

The `_dev/` folder is ignored by Git and is not part of the deployed site.

## Sections

About
Essays
Guides
Blog
Tags
Archive
Metadata

Metadata is generated as a public index at `/metadata.html`, with individual field pages under `/metadata/`. Metadata entries behave like tags: each distinct entry gets its own generated page, such as `/metadata/type/blog.html` or `/metadata/tags/debug.html`. Tags are part of the metadata system at `/metadata/tags.html`; this is the only generated tags index. The sidebar Tags link points there directly. Post-footer metadata cards link to the relevant post block on `/metadata.html`.

The base metadata pages are always generated, even if there are no visible posts. This includes `/metadata/slug.html`, `/metadata/title.html`, `/metadata/type.html`, `/metadata/date.html`, `/metadata/revised.html`, `/metadata/tags.html`, `/metadata/abstract.html`, and `/metadata/word_count.html`. Empty metadata pages keep their compact count line, such as `0 posts · 0 entries`, and display `No posts yet.` instead of failing.

## Behaviour

The site is statically generated.

Page content is written directly into generated HTML files.

The browser does not need client-side JavaScript to show posts, sections, archive pages, metadata tag pages, the About page, or individual post content.

sidebar.js controls the collapsible sidebar, mobile outside-click closing, auto-collapse behaviour, and the dormant back-button listener. The generated back button is disabled by `show_back_button = false` in `build.js`.

## Adding a post

Add a new object inside the posts array in posts.js.

Example:

{
  slug: "example_post",
  title: "Example Post",
  type: "essays",
  date: "2026-05-25",
  revised: "2026-05-26",
  edition: "1st edition",
  tags: ["example", "notes"],
  abstract: "Short abstract here.",
  body:
    '<p>Post body here.</p>'
}

Valid type values:

essays
guides
blog

revised is optional.

If present, it displays as:

revised YYYY-MM-DD

tags is optional, but should be an array when used.

## Editions

To publish a new edition, add a new post with the same title and type, but with:

new slug
newer date
new edition
updated body

Section pages show only the latest edition of a post.

The archive shows all editions.

Tag pages are generated only as metadata pages under `/metadata/tags/` and show matching visible posts. There is no separate `/tags.html` compatibility page.

## Build

GitHub Actions builds the site automatically after a push to main.

The workflow runs:

node build.js

The generated site is written to:

_site/

## Generated files

The build writes `robots.txt` into `_site/robots.txt`, because `_site/` is the published site root. The source logic for this file lives in `build.js`. The file allows the public static site generally, links the sitemap, and blocks a set of known AI-training or bulk-scraping crawler user agents where those crawlers choose to respect `robots.txt`.

The build writes RSS 2.0 feeds for the whole site and for each post type:

- `/feed.xml`
- `/essays/feed.xml`
- `/guides/feed.xml`
- `/blog/feed.xml`

Feed-discovery `<link rel="alternate" type="application/rss+xml">` tags are generated in page heads. The main feed is advertised on all pages. Section pages and matching post pages also advertise their section-specific feed. The feeds are included in `sitemap.xml`.

Every generated HTML page includes a canonical URL in the page head. Canonical URLs are generated from the output file path and the configured site URL.

The build writes `/search-index.json` for future archive search and filtering. The search index contains visible posts only and deliberately omits full post body text. It includes post titles, URLs, types, dates, revised dates, abstracts, tags, word counts, selected public metadata, and compact search text. It is not included in `sitemap.xml`.

## Minimap

Post pages with enough headings include a sidebar minimap. The minimap uses `/`, `>`, `>>`, and `>>>` markers for the post title, `h2`, `h3`, and `h4` levels. As the reader scrolls, the progress bar fills and passed heading markers increase in opacity as milestone ticks. The active and hover behaviours remain separate.

## Local diagnostics

After building the site, you can manually generate local diagnostic files:

```bash
node build.js
py tools/site_graph.py
```

On systems where `python` is the command name, use:

```bash
python tools/site_graph.py
```

The script reads `_site/` and writes:

- `_dev/site-skeleton.txt` — a human-readable outline of generated pages and support files.
- `_dev/site-graph.json` — a machine-readable local graph of generated files, internal links, canonical URLs, RSS alternates, sitemap membership, and warnings.

The diagnostic script uses only the Python standard library and performs no network requests.

## Deployment

GitHub Pages should use:

Source: GitHub Actions

The published site comes from the generated _site folder.

## Copyright

anodyne avenue ©

## Versioning

The root-level `version.txt` file stores the source version in this format:

`1.X.YY.MM.DD.Increment`

`X` is manually controlled. Each time `node build.js` runs, the build script preserves `X`, updates the date, increments the final number, writes the new value back to `version.txt`, and renders it visibly in the sidebar footer as `v1.X.YY.MM.DD.Increment`.

Because this edits `version.txt`, commit that file after a local build if you want the version change to become the canonical repository version.

