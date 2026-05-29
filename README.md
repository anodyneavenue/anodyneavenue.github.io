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
.github/        GitHub Pages build workflow

Generated site:

_site/index.html
_site/essays.html
_site/guides.html
_site/blog.html
_site/archive.html
_site/tags.html        compatibility link to /metadata/tags.html
_site/metadata.html
_site/metadata/       public metadata field and value pages, including tags
_site/posts/

The generated _site folder is published by GitHub Actions.

## Sections

Essays
Guides
Blog
Metadata
Tags
Archive

Metadata is generated as a public index at `/metadata.html`, with individual field pages under `/metadata/`. Tags are part of the metadata system at `/metadata/tags.html`; the sidebar Tags link points there directly. Post-footer metadata cards link to the relevant post block on `/metadata.html`.

The base metadata pages are always generated, even if there are no visible posts. This includes `/metadata/slug.html`, `/metadata/title.html`, `/metadata/type.html`, `/metadata/date.html`, `/metadata/tags.html`, `/metadata/abstract.html`, and `/metadata/word_count.html`. Empty metadata pages display `No posts yet.` instead of failing.

## Behaviour

The site is statically generated.

Page content is written directly into generated HTML files.

The browser does not need client-side JavaScript to show posts, sections, archive pages, tag pages, or individual post content.

sidebar.js only controls the collapsible sidebar, mobile outside-click closing, auto-collapse behaviour, and the back button.

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

Tag pages are generated as metadata value pages under `/metadata/tags/` and show matching visible posts.

## Build

GitHub Actions builds the site automatically after a push to main.

The workflow runs:

node build.js

The generated site is written to:

_site/

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

